/**
 * Signal — Social Analytics Backend (GoDaddy Node.js Hosting edition)
 * ---------------------------------------------------------------------
 * Handles OAuth token exchange and analytics fetching for YouTube,
 * Facebook, Instagram, and TikTok, so client secrets never live in the
 * browser-side dashboard artifact.
 *
 * Built for GoDaddy Node.js Hosting: reads PORT from the environment,
 * reads secrets from process.env (set via the .env upload in GoDaddy's
 * dashboard), and stores OAuth tokens in GoDaddy's managed MySQL
 * database instead of any external KV store.
 *
 * See README.md for full setup instructions.
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { getPool, ensureSchema } = require('./db');
const { startScheduler } = require('./scheduler');
const {
  findOrCreateUser,
  issueSessionToken,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  buildGoogleLoginUrl,
  exchangeGoogleLoginCode,
} = require('./auth');

const app = express();
// credentials: true + explicit origin (not '*') is required for
// cross-site cookies to work between the dashboard's origin and this
// backend. Set DASHBOARD_ORIGIN to the exact artifact URL — see README.
app.use(cors({ origin: process.env.DASHBOARD_ORIGIN || true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// Uploaded videos land here. This directory must persist across app
// restarts for scheduled posts to work — GoDaddy Node.js Hosting keeps
// your app's own filesystem between requests within a running instance;
// see README.md for what to check if your plan recycles storage.
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const id = crypto.randomBytes(12).toString('hex');
      const ext = path.extname(file.originalname) || '.mp4';
      cb(null, `${id}${ext}`);
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB — platform-side limits still apply on top
});

// Serves uploaded videos over plain HTTPS so Instagram/TikTok's
// PULL_FROM_URL flows can fetch them. Requires PUBLIC_BASE_URL to be
// set to this backend's real public URL (see .env.example).
app.use('/media', express.static(UPLOAD_DIR));

const PLATFORMS = {
  youtube: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    // .readonly covers analytics; .upload is additionally needed to
    // publish videos. Requesting both means one login covers everything.
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
    clientIdEnv: 'YOUTUBE_CLIENT_ID',
    clientSecretEnv: 'YOUTUBE_CLIENT_SECRET',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    // publish_video added on top of the read scopes for posting.
    scope: 'pages_read_engagement,pages_show_list,read_insights,publish_video',
    clientIdEnv: 'FACEBOOK_APP_ID',
    clientSecretEnv: 'FACEBOOK_APP_SECRET',
  },
  instagram: {
    // Instagram Business accounts authenticate through the same Meta app
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    // instagram_business_content_publish added on top of read scopes —
    // this one specifically needs Meta App Review before it's granted
    // for real (see README); requesting it here means it's ready the
    // moment your review clears, no code changes needed then.
    scope: 'instagram_basic,instagram_manage_insights,pages_show_list,instagram_business_content_publish',
    clientIdEnv: 'FACEBOOK_APP_ID',
    clientSecretEnv: 'FACEBOOK_APP_SECRET',
  },
  tiktok: {
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    // video.publish added on top of read scopes for posting.
    scope: 'user.info.basic,user.info.stats,video.list,video.publish',
    clientIdEnv: 'TIKTOK_CLIENT_KEY',
    clientSecretEnv: 'TIKTOK_CLIENT_SECRET',
  },
};

function randomId() {
  return crypto.randomBytes(16).toString('hex');
}

// ---------------- Sign in with Google (Signal accounts) ----------------
// This is a DIFFERENT OAuth flow from the per-platform connections below
// — this one is "how does a stranger get an account on Signal at all."

app.get('/auth/login', (req, res) => {
  const redirectUri = req.query.redirect_uri;
  if (!redirectUri) return res.status(400).json({ error: 'missing_redirect_uri' });
  // Prefixed the same way platform-connect states are (`${platform}:...`)
  // so the dashboard's single OAuth-return dispatcher can tell "this was
  // a Signal sign-in" apart from "this was a YouTube/Facebook/etc connect"
  // just by looking at the text before the first colon.
  const state = `signal_login:${randomId()}`;
  const loginUrl = buildGoogleLoginUrl(redirectUri, state);
  res.json({ loginUrl });
});

app.post('/auth/callback', async (req, res) => {
  const { code, redirectUri } = req.body || {};
  if (!code || !redirectUri) return res.status(400).json({ error: 'missing_params' });

  try {
    const profile = await exchangeGoogleLoginCode(code, redirectUri);
    const user = await findOrCreateUser(profile);
    const token = issueSessionToken(user);
    setSessionCookie(res, token);
    res.json({
      ok: true,
      token, // also returned in the body for clients that store it themselves rather than relying on the cookie
      user: { id: user.id, email: user.email, name: user.name, pictureUrl: user.picture_url },
    });
  } catch (err) {
    res.status(400).json({ error: 'login_failed', message: String(err) });
  }
});

app.post('/auth/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/auth/me', requireAuth, async (req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(`SELECT id, email, name, picture_url, created_at FROM users WHERE id = $1`, [req.userId]);
    if (!rows.length) return res.status(404).json({ error: 'user_not_found' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'db_error', message: String(err) });
  }
});

// ---------------- DB helpers ----------------
async function storeToken(userId, platform, tokenData) {
  const pool = getPool();
  await pool.query(
    `INSERT INTO tokens (user_id, platform, token_json, obtained_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id, platform) DO UPDATE
       SET token_json = EXCLUDED.token_json, obtained_at = NOW()`,
    [userId, platform, JSON.stringify(tokenData)]
  );
}

async function getToken(userId, platform) {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT token_json FROM tokens WHERE user_id = $1 AND platform = $2 LIMIT 1`,
    [userId, platform]
  );
  if (!rows.length) return null;
  return JSON.parse(rows[0].token_json);
}

// ---------------- Routes ----------------

app.get('/status', requireAuth, async (req, res) => {
  const configured = {};
  const connected = {};
  for (const platform of Object.keys(PLATFORMS)) {
    const cfg = PLATFORMS[platform];
    configured[platform] = Boolean(process.env[cfg.clientIdEnv] && process.env[cfg.clientSecretEnv]);
    connected[platform] = Boolean(await getToken(req.userId, platform));
  }
  res.json({ configured, connected });
});

app.get('/auth/:platform/start', requireAuth, (req, res) => {
  const platform = req.params.platform;
  const cfg = PLATFORMS[platform];
  if (!cfg) return res.status(400).json({ error: 'unknown_platform' });

  const redirectUri = req.query.redirect_uri;
  if (!redirectUri) return res.status(400).json({ error: 'missing_redirect_uri' });

  const clientId = process.env[cfg.clientIdEnv];
  if (!clientId) {
    return res.status(400).json({ error: 'not_configured', message: `${platform} credentials not set on backend yet` });
  }

  // The signed-in user's id rides in `state` so the callback (which
  // Google/Meta/TikTok calls back to, with no cookie context of its
  // own guaranteed) knows which Signal account to attach the platform
  // token to.
  const state = `${platform}:${req.userId}`;
  const authUrl = new URL(cfg.authUrl);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', cfg.scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('response_type', 'code');

  if (platform === 'youtube') {
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
  } else if (platform === 'facebook' || platform === 'instagram') {
    authUrl.searchParams.set('client_id', clientId);
  } else if (platform === 'tiktok') {
    authUrl.searchParams.set('client_key', clientId);
  }

  res.json({ authUrl: authUrl.toString() });
});

app.post('/auth/:platform/callback', requireAuth, async (req, res) => {
  const platform = req.params.platform;
  const cfg = PLATFORMS[platform];
  if (!cfg) return res.status(400).json({ error: 'unknown_platform' });

  const { code, redirectUri } = req.body || {};
  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'missing_params' });
  }

  const clientId = process.env[cfg.clientIdEnv];
  const clientSecret = process.env[cfg.clientSecretEnv];
  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'not_configured', message: `${platform} credentials not set on backend yet` });
  }

  let tokenResp;
  try {
    if (platform === 'tiktok') {
      tokenResp = await fetch(cfg.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
        body: new URLSearchParams({
          client_key: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });
    } else {
      tokenResp = await fetch(cfg.tokenUrl, {
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
    }
  } catch (err) {
    return res.status(502).json({ error: 'token_exchange_failed', message: String(err) });
  }

  if (!tokenResp.ok) {
    const errText = await tokenResp.text();
    return res.status(400).json({ error: 'token_exchange_rejected', message: errText });
  }

  const tokenData = await tokenResp.json();
  await storeToken(req.userId, platform, tokenData);
  res.json({ ok: true });
});

app.get('/stats/:platform', requireAuth, async (req, res) => {
  const platform = req.params.platform;
  const tokenData = await getToken(req.userId, platform);
  if (!tokenData) return res.status(401).json({ error: 'not_connected', platform });

  const accessToken = tokenData.access_token;

  try {
    if (platform === 'youtube') {
      const chanResp = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!chanResp.ok) return res.status(502).json({ error: 'upstream_error', status: chanResp.status, body: await chanResp.text() });
      const chanData = await chanResp.json();
      const stats = (chanData.items && chanData.items[0] && chanData.items[0].statistics) || {};
      return res.json({
        platform: 'youtube',
        followers: stats.subscriberCount ? Number(stats.subscriberCount) : null,
        views: stats.viewCount ? Number(stats.viewCount) : null,
        likes: null,
        comments: null,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (platform === 'facebook') {
      const pagesResp = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
      if (!pagesResp.ok) return res.status(502).json({ error: 'upstream_error', status: pagesResp.status, body: await pagesResp.text() });
      const pagesData = await pagesResp.json();
      const page = pagesData.data && pagesData.data[0];
      if (!page) return res.status(404).json({ error: 'no_page_found' });

      const insightsResp = await fetch(
        `https://graph.facebook.com/v19.0/${page.id}?fields=fan_count,followers_count&access_token=${page.access_token || accessToken}`
      );
      const insightsData = insightsResp.ok ? await insightsResp.json() : {};

      return res.json({
        platform: 'facebook',
        followers: insightsData.followers_count ?? insightsData.fan_count ?? null,
        views: null,
        likes: null,
        comments: null,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (platform === 'instagram') {
      const pagesResp = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
      );
      if (!pagesResp.ok) return res.status(502).json({ error: 'upstream_error', status: pagesResp.status, body: await pagesResp.text() });
      const pagesData = await pagesResp.json();
      const igAccount = (pagesData.data || []).find(p => p.instagram_business_account);
      if (!igAccount) return res.status(404).json({ error: 'no_ig_account_linked' });

      const igResp = await fetch(
        `https://graph.facebook.com/v19.0/${igAccount.instagram_business_account.id}?fields=followers_count,media_count&access_token=${accessToken}`
      );
      const igData = igResp.ok ? await igResp.json() : {};

      return res.json({
        platform: 'instagram',
        followers: igData.followers_count ?? null,
        views: null,
        likes: null,
        comments: null,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (platform === 'tiktok') {
      const userResp = await fetch(
        'https://open.tiktokapis.com/v2/user/info/?fields=follower_count,likes_count,video_count',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!userResp.ok) return res.status(502).json({ error: 'upstream_error', status: userResp.status, body: await userResp.text() });
      const userData = await userResp.json();
      const u = (userData.data && userData.data.user) || {};

      return res.json({
        platform: 'tiktok',
        followers: u.follower_count ?? null,
        views: null,
        likes: u.likes_count ?? null,
        comments: null,
        fetchedAt: new Date().toISOString(),
      });
    }

    return res.status(400).json({ error: 'unknown_platform' });
  } catch (err) {
    return res.status(502).json({ error: 'fetch_failed', message: String(err) });
  }
});

// ---------------- Top / trending video per platform ----------------
// Returns the single best-performing video for the connected account on
// each platform, ranked by view count (or likes for platforms whose read
// scope doesn't expose view counts per video).
app.get('/top-video/:platform', requireAuth, async (req, res) => {
  const platform = req.params.platform;
  const tokenData = await getToken(req.userId, platform);
  if (!tokenData) return res.status(401).json({ error: 'not_connected', platform });

  const accessToken = tokenData.access_token;

  try {
    if (platform === 'youtube') {
      // 1. Find the channel's uploads playlist
      const chanResp = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!chanResp.ok) return res.status(502).json({ error: 'upstream_error', status: chanResp.status, body: await chanResp.text() });
      const chanData = await chanResp.json();
      const uploadsPlaylistId = chanData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!uploadsPlaylistId) return res.status(404).json({ error: 'no_uploads_found' });

      // 2. Get recent video ids from that playlist (most recent 50 — a
      // practical window rather than the channel's entire history)
      const plResp = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!plResp.ok) return res.status(502).json({ error: 'upstream_error', status: plResp.status, body: await plResp.text() });
      const plData = await plResp.json();
      const videoIds = (plData.items || []).map(i => i.contentDetails.videoId).filter(Boolean);
      if (videoIds.length === 0) return res.status(404).json({ error: 'no_videos_found' });

      // 3. Get stats for those videos and pick the top by view count
      const statsResp = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!statsResp.ok) return res.status(502).json({ error: 'upstream_error', status: statsResp.status, body: await statsResp.text() });
      const statsData = await statsResp.json();
      const items = statsData.items || [];
      if (items.length === 0) return res.status(404).json({ error: 'no_videos_found' });

      const top = items.reduce((best, v) => {
        const views = Number(v.statistics?.viewCount || 0);
        return (!best || views > best._views) ? Object.assign(v, { _views: views }) : best;
      }, null);

      return res.json({
        platform: 'youtube',
        title: top.snippet?.title || null,
        thumbnailUrl: top.snippet?.thumbnails?.medium?.url || top.snippet?.thumbnails?.default?.url || null,
        views: Number(top.statistics?.viewCount || 0),
        likes: Number(top.statistics?.likeCount || 0),
        comments: Number(top.statistics?.commentCount || 0),
        permalink: `https://www.youtube.com/watch?v=${top.id}`,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (platform === 'facebook') {
      const pagesResp = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
      if (!pagesResp.ok) return res.status(502).json({ error: 'upstream_error', status: pagesResp.status, body: await pagesResp.text() });
      const pagesData = await pagesResp.json();
      const page = pagesData.data && pagesData.data[0];
      if (!page) return res.status(404).json({ error: 'no_page_found' });
      const pageToken = page.access_token || accessToken;

      const videosResp = await fetch(
        `https://graph.facebook.com/v19.0/${page.id}/videos?fields=title,description,permalink_url,picture,views,likes.summary(true)&limit=25&access_token=${pageToken}`
      );
      if (!videosResp.ok) return res.status(502).json({ error: 'upstream_error', status: videosResp.status, body: await videosResp.text() });
      const videosData = await videosResp.json();
      const items = videosData.data || [];
      if (items.length === 0) return res.status(404).json({ error: 'no_videos_found' });

      const top = items.reduce((best, v) => {
        const views = Number(v.views || 0);
        return (!best || views > best._views) ? Object.assign(v, { _views: views }) : best;
      }, null);

      return res.json({
        platform: 'facebook',
        title: top.title || top.description?.slice(0, 80) || null,
        thumbnailUrl: top.picture || null,
        views: Number(top.views || 0),
        likes: Number(top.likes?.summary?.total_count || 0),
        comments: null,
        permalink: top.permalink_url ? `https://facebook.com${top.permalink_url}` : null,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (platform === 'instagram') {
      const pagesResp = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
      );
      if (!pagesResp.ok) return res.status(502).json({ error: 'upstream_error', status: pagesResp.status, body: await pagesResp.text() });
      const pagesData = await pagesResp.json();
      const igAccount = (pagesData.data || []).find(p => p.instagram_business_account);
      if (!igAccount) return res.status(404).json({ error: 'no_ig_account_linked' });
      const igId = igAccount.instagram_business_account.id;

      const mediaResp = await fetch(
        `https://graph.facebook.com/v19.0/${igId}/media?fields=caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count&limit=25&access_token=${accessToken}`
      );
      if (!mediaResp.ok) return res.status(502).json({ error: 'upstream_error', status: mediaResp.status, body: await mediaResp.text() });
      const mediaData = await mediaResp.json();
      const items = (mediaData.data || []).filter(m => m.media_type === 'VIDEO' || m.media_type === 'REELS');
      if (items.length === 0) return res.status(404).json({ error: 'no_videos_found' });

      // Instagram's basic media fields don't include view/play counts
      // without the extra insights scope, so rank by likes here.
      const top = items.reduce((best, v) => {
        const likes = Number(v.like_count || 0);
        return (!best || likes > best._likes) ? Object.assign(v, { _likes: likes }) : best;
      }, null);

      return res.json({
        platform: 'instagram',
        title: top.caption?.slice(0, 80) || null,
        thumbnailUrl: top.thumbnail_url || top.media_url || null,
        views: null,
        likes: Number(top.like_count || 0),
        comments: Number(top.comments_count || 0),
        permalink: top.permalink || null,
        fetchedAt: new Date().toISOString(),
        note: 'Ranked by likes — view counts need an additional Meta-reviewed scope (instagram_manage_insights beyond basic).',
      });
    }

    if (platform === 'tiktok') {
      const listResp = await fetch(
        'https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url,share_url,view_count,like_count,comment_count',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ max_count: 20 }),
        }
      );
      if (!listResp.ok) return res.status(502).json({ error: 'upstream_error', status: listResp.status, body: await listResp.text() });
      const listData = await listResp.json();
      const items = listData.data?.videos || [];
      if (items.length === 0) return res.status(404).json({ error: 'no_videos_found' });

      const top = items.reduce((best, v) => {
        const views = Number(v.view_count || 0);
        return (!best || views > best._views) ? Object.assign(v, { _views: views }) : best;
      }, null);

      return res.json({
        platform: 'tiktok',
        title: top.title || null,
        thumbnailUrl: top.cover_image_url || null,
        views: Number(top.view_count || 0),
        likes: Number(top.like_count || 0),
        comments: Number(top.comment_count || 0),
        permalink: top.share_url || null,
        fetchedAt: new Date().toISOString(),
      });
    }

    return res.status(400).json({ error: 'unknown_platform' });
  } catch (err) {
    return res.status(502).json({ error: 'fetch_failed', message: String(err) });
  }
});

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'signal-backend', platforms: Object.keys(PLATFORMS) });
});

// ---------------- Daily analytics entries ----------------
// Centralized replacement for what used to be written directly into
// the dashboard artifact's own per-browser storage — now every user's
// history lives here, tied to their account, reachable from any device.

app.post('/entries', requireAuth, async (req, res) => {
  const { date, platform, followers, views, likes, comments, source } = req.body || {};
  if (!date || !platform) return res.status(400).json({ error: 'missing_params' });

  try {
    const pool = getPool();
    await pool.query(
      `INSERT INTO entries (user_id, entry_date, platform, followers, views, likes, comments, source, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (user_id, entry_date, platform) DO UPDATE
         SET followers = EXCLUDED.followers, views = EXCLUDED.views, likes = EXCLUDED.likes,
             comments = EXCLUDED.comments, source = EXCLUDED.source, updated_at = NOW()`,
      [
        req.userId, date, platform,
        followers ?? null, views ?? null, likes ?? null, comments ?? null,
        source || 'manual',
      ]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'db_error', message: String(err) });
  }
});

app.get('/entries', requireAuth, async (req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT entry_date, platform, followers, views, likes, comments, source
       FROM entries WHERE user_id = $1 ORDER BY entry_date ASC`,
      [req.userId]
    );
    // Reshape into { date: { platform: {...} } } — the exact structure
    // the dashboard already keeps in memory, so its rendering code
    // doesn't need to change, only where the data comes from.
    const byDate = {};
    rows.forEach(r => {
      const dateStr = r.entry_date instanceof Date
        ? r.entry_date.toISOString().slice(0, 10)
        : String(r.entry_date).slice(0, 10);
      byDate[dateStr] = byDate[dateStr] || {};
      byDate[dateStr][r.platform] = {
        followers: r.followers, views: r.views, likes: r.likes, comments: r.comments,
      };
    });
    res.json({ entries: byDate });
  } catch (err) {
    res.status(500).json({ error: 'db_error', message: String(err) });
  }
});

// ---------------- Post upload + scheduling ----------------
app.post('/posts', requireAuth, upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'missing_video' });

  let platforms, captions;
  try {
    platforms = JSON.parse(req.body.platforms || '[]');
    captions = JSON.parse(req.body.captions || '{}');
  } catch (e) {
    return res.status(400).json({ error: 'invalid_json', message: 'platforms/captions must be valid JSON' });
  }

  if (platforms.length === 0) {
    return res.status(400).json({ error: 'missing_params' });
  }

  const scheduledFor = req.body.scheduledFor || null;
  const postNow = req.body.postNow === 'true';
  const postId = crypto.randomBytes(12).toString('hex');

  try {
    const pool = getPool();
    await pool.query(
      `INSERT INTO posts (id, user_id, file_path, file_name, captions_json, platforms_json, scheduled_for, created_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)`,
      [
        postId,
        req.userId,
        req.file.path,
        req.file.originalname,
        JSON.stringify(captions),
        JSON.stringify(platforms),
        scheduledFor || null,
        postNow ? 'processing' : 'scheduled',
      ]
    );
    return res.json({ ok: true, postId });
  } catch (err) {
    return res.status(500).json({ error: 'db_error', message: String(err) });
  }
});

app.get('/posts', requireAuth, async (req, res) => {
  try {
    const pool = getPool();
    const { rows: posts } = await pool.query(
      `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.userId]
    );

    let results = [];
    if (posts.length > 0) {
      const placeholders = posts.map((_, i) => `$${i + 1}`).join(',');
      const resultQuery = await pool.query(
        `SELECT * FROM post_results WHERE post_id IN (${placeholders})`,
        posts.map(p => p.id)
      );
      results = resultQuery.rows;
    }

    const resultsByPost = {};
    results.forEach(r => {
      resultsByPost[r.post_id] = resultsByPost[r.post_id] || [];
      resultsByPost[r.post_id].push({
        platform: r.platform,
        status: r.status,
        message: r.message,
        permalink: r.permalink,
      });
    });

    return res.json({
      posts: posts.map(p => ({
        id: p.id,
        fileName: p.file_name,
        platforms: JSON.parse(p.platforms_json || '[]'),
        captions: JSON.parse(p.captions_json || '{}'),
        scheduledFor: p.scheduled_for,
        status: p.status,
        createdAt: p.created_at,
        results: resultsByPost[p.id] || [],
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: 'db_error', message: String(err) });
  }
});

// ---------------- Boot ----------------
async function start() {
  try {
    await ensureSchema();
    console.log('Database schema ready.');
  } catch (err) {
    console.error('Could not initialize database schema — check DB env vars.', err);
  }
  startScheduler();
  app.listen(PORT, () => {
    console.log(`Signal backend listening on port ${PORT}`);
  });
}

start();
