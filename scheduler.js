/**
 * scheduler.js — checks the `posts` table on a timer, and for any post
 * that is due (scheduled_for <= now, or status='processing' meaning
 * "post now" was requested), publishes it to each of its selected
 * platforms and records a per-platform result.
 */

const cron = require('node-cron');
const path = require('path');
const { getPool } = require('./db');
const { publishYouTube, publishFacebook, publishInstagram, publishTikTok } = require('./publishers');

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || '';

async function getToken(userId, platform) {
  const { rows } = await getPool().query(
    `SELECT token_json FROM tokens WHERE user_id = $1 AND platform = $2 LIMIT 1`,
    [userId, platform]
  );
  return rows.length ? JSON.parse(rows[0].token_json) : null;
}

async function recordResult(postId, platform, result) {
  const pool = getPool();
  await pool.query(
    `INSERT INTO post_results (post_id, platform, status, message, remote_id, permalink, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (post_id, platform) DO UPDATE
       SET status = EXCLUDED.status, message = EXCLUDED.message,
           remote_id = EXCLUDED.remote_id, permalink = EXCLUDED.permalink, updated_at = NOW()`,
    [postId, platform, result.ok ? 'posted' : 'failed', result.message || null, result.remoteId || null, result.permalink || null]
  );
}

async function processPost(post) {
  const pool = getPool();
  const platforms = JSON.parse(post.platforms_json || '[]');
  const captions = JSON.parse(post.captions_json || '{}');
  const filePath = post.file_path;
  const fileName = path.basename(filePath);
  const publicUrl = PUBLIC_BASE_URL ? `${PUBLIC_BASE_URL.replace(/\/$/, '')}/media/${fileName}` : null;

  let anySucceeded = false;
  let anyFailed = false;

  for (const platform of platforms) {
    const tokenData = await getToken(post.user_id, platform);
    if (!tokenData) {
      await recordResult(post.id, platform, { ok: false, message: `${platform} is not connected for this account` });
      anyFailed = true;
      continue;
    }

    const caption = captions[platform] || '';
    const accessToken = tokenData.access_token;

    try {
      let result;
      if (platform === 'youtube') {
        result = await publishYouTube({ filePath, caption, accessToken });
      } else if (platform === 'facebook') {
        result = await publishFacebook({ filePath, caption, accessToken });
      } else if (platform === 'instagram') {
        if (!publicUrl) {
          result = { ok: false, message: 'PUBLIC_BASE_URL is not set on the backend — Instagram needs a public video URL to fetch from.' };
        } else {
          result = await publishInstagram({ videoPublicUrl: publicUrl, caption, accessToken });
        }
      } else if (platform === 'tiktok') {
        if (!publicUrl) {
          result = { ok: false, message: 'PUBLIC_BASE_URL is not set on the backend — TikTok needs a public video URL to fetch from.' };
        } else {
          result = await publishTikTok({ videoPublicUrl: publicUrl, caption, accessToken });
        }
      } else {
        result = { ok: false, message: `Unknown platform: ${platform}` };
      }

      await recordResult(post.id, platform, result);
      if (result.ok) anySucceeded = true; else anyFailed = true;
    } catch (err) {
      await recordResult(post.id, platform, { ok: false, message: String(err) });
      anyFailed = true;
    }
  }

  const finalStatus = anyFailed && !anySucceeded ? 'failed' : (anyFailed ? 'partial' : 'posted');
  await pool.query(`UPDATE posts SET status = $1 WHERE id = $2`, [finalStatus, post.id]);
}

async function tick() {
  const pool = getPool();
  const { rows: dueScheduled } = await pool.query(
    `SELECT * FROM posts WHERE status = 'scheduled' AND scheduled_for <= NOW()`
  );
  const { rows: dueNow } = await pool.query(
    `SELECT * FROM posts WHERE status = 'processing'`
  );

  const due = [...dueScheduled, ...dueNow];
  for (const post of due) {
    // Mark as processing immediately so a slow publish doesn't get picked up twice
    await pool.query(`UPDATE posts SET status = 'processing' WHERE id = $1`, [post.id]);
    try {
      await processPost(post);
    } catch (err) {
      console.error('processPost failed for', post.id, err);
      await pool.query(`UPDATE posts SET status = 'failed' WHERE id = $1`, [post.id]);
    }
  }
}

function startScheduler() {
  // Every minute — frequent enough that "post now" feels near-instant,
  // without hammering the database.
  cron.schedule('* * * * *', () => {
    tick().catch(err => console.error('scheduler tick failed', err));
  });
  console.log('Scheduler started — checking for due posts every minute.');
}

module.exports = { startScheduler, tick };
