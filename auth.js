/**
 * auth.js — "Sign in with Google" for END USERS of this app (distinct
 * from the per-platform OAuth in server.js, which connects a signed-in
 * user's Instagram/YouTube/etc — this is what lets a stranger create an
 * account on Signal itself in the first place).
 *
 * Flow:
 *   1. GET /auth/login redirects to Google's consent screen
 *   2. Google redirects back to /auth/callback with a code
 *   3. We exchange it for the person's Google profile (id, email, name)
 *   4. We find-or-create a row in `users` for that Google id
 *   5. We issue our OWN session token (a signed JWT) as an httpOnly
 *      cookie, which the dashboard then sends on every request
 *
 * Requires GOOGLE_LOGIN_CLIENT_ID / GOOGLE_LOGIN_CLIENT_SECRET — these
 * are DIFFERENT from YOUTUBE_CLIENT_ID/SECRET. You can reuse the same
 * Google Cloud project, but you need a redirect URI on this app's own
 * login callback (see README) distinct from the YouTube analytics
 * connection's redirect.
 */

const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { getPool } = require('./db');

const JWT_SECRET = process.env.SESSION_JWT_SECRET;
const COOKIE_NAME = 'signal_session';

function requireJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error(
      'SESSION_JWT_SECRET is not set. Generate a long random string and add it as a secret before using sign-in.'
    );
  }
}

async function findOrCreateUser({ googleId, email, name, pictureUrl }) {
  const pool = getPool();
  const { rows: existing } = await pool.query(
    `SELECT * FROM users WHERE google_id = $1 LIMIT 1`,
    [googleId]
  );
  if (existing.length) return existing[0];

  await pool.query(
    `INSERT INTO users (google_id, email, name, picture_url, created_at) VALUES ($1, $2, $3, $4, NOW())`,
    [googleId, email, name || null, pictureUrl || null]
  );
  const { rows: created } = await pool.query(`SELECT * FROM users WHERE google_id = $1 LIMIT 1`, [googleId]);
  return created[0];
}

function issueSessionToken(user) {
  requireJwtSecret();
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none', // dashboard runs on a different origin (claude.ai)
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

// Middleware: reads the session cookie OR an Authorization: Bearer
// header (for clients that can't rely on cross-site cookies), verifies
// it, and attaches req.userId. Rejects with 401 if missing/invalid.
function requireAuth(req, res, next) {
  requireJwtSecret();
  let token = req.cookies && req.cookies[COOKIE_NAME];
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  }
  if (!token) return res.status(401).json({ error: 'not_signed_in' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_session' });
  }
}

function buildGoogleLoginUrl(redirectUri, state) {
  const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  return url.toString();
}

async function exchangeGoogleLoginCode(code, redirectUri) {
  const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_LOGIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_LOGIN_CLIENT_ID / GOOGLE_LOGIN_CLIENT_SECRET not configured');
  }

  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenResp.ok) {
    throw new Error(`Google token exchange failed: ${await tokenResp.text()}`);
  }
  const tokenData = await tokenResp.json();

  const profileResp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!profileResp.ok) {
    throw new Error(`Google profile fetch failed: ${await profileResp.text()}`);
  }
  const profile = await profileResp.json();

  return {
    googleId: profile.id,
    email: profile.email,
    name: profile.name,
    pictureUrl: profile.picture,
  };
}

module.exports = {
  findOrCreateUser,
  issueSessionToken,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  buildGoogleLoginUrl,
  exchangeGoogleLoginCode,
  COOKIE_NAME,
};
