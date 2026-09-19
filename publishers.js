/**
 * publishers.js — one function per platform that takes a local video
 * file path + caption text + an access token, and publishes it to that
 * platform. Each returns { ok, remoteId, permalink, message }.
 *
 * IMPORTANT HONESTY NOTE (read before wiring up real posting):
 * Every platform below forces uploaded content to PRIVATE/invisible
 * until you pass that platform's own separate content/compliance audit.
 * These functions will run and often report success — the video really
 * does land on the platform — but it won't be publicly visible until
 * the relevant audit clears. See README.md for what's needed per
 * platform. This is each platform's policy, not a bug here.
 */

const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

// ---------------- YouTube ----------------
// Resumable upload protocol: POST to start a session, then PUT the file.
async function publishYouTube({ filePath, caption, accessToken }) {
  const title = (caption || 'Untitled').slice(0, 100);
  const description = caption || '';
  const fileSize = fs.statSync(filePath).size;

  const metadata = {
    snippet: { title, description },
    status: { privacyStatus: 'private' }, // start private; see note above re: audits
  };

  // Phase 1: initiate resumable session
  const initResp = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'video/*',
        'X-Upload-Content-Length': String(fileSize),
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!initResp.ok) {
    return { ok: false, message: `YouTube session init failed: ${await initResp.text()}` };
  }

  const uploadUrl = initResp.headers.get('location');
  if (!uploadUrl) {
    return { ok: false, message: 'YouTube did not return an upload URL' };
  }

  // Phase 2: PUT the file bytes
  const fileStream = fs.createReadStream(filePath);
  const putResp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Length': String(fileSize) },
    body: fileStream,
  });

  if (!putResp.ok) {
    return { ok: false, message: `YouTube upload failed: ${await putResp.text()}` };
  }

  const result = await putResp.json();
  return {
    ok: true,
    remoteId: result.id,
    permalink: `https://www.youtube.com/watch?v=${result.id}`,
    message: 'Uploaded as private — becomes public once your channel passes the YouTube API Compliance Audit.',
  };
}

// ---------------- Facebook ----------------
async function publishFacebook({ filePath, caption, accessToken }) {
  // Facebook posting needs a Page access token, not the user token —
  // fetch the first managed Page's token first.
  const pagesResp = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
  if (!pagesResp.ok) return { ok: false, message: `Facebook: couldn't list pages (${await pagesResp.text()})` };
  const pagesData = await pagesResp.json();
  const page = pagesData.data && pagesData.data[0];
  if (!page) return { ok: false, message: 'Facebook: no managed Page found on this account' };

  const form = new FormData();
  form.append('source', fs.createReadStream(filePath));
  form.append('description', caption || '');
  form.append('access_token', page.access_token || accessToken);

  const uploadResp = await fetch(`https://graph-video.facebook.com/v19.0/${page.id}/videos`, {
    method: 'POST',
    body: form,
  });

  if (!uploadResp.ok) {
    return { ok: false, message: `Facebook upload failed: ${await uploadResp.text()}` };
  }

  const result = await uploadResp.json();
  return {
    ok: true,
    remoteId: result.id,
    permalink: result.id ? `https://facebook.com/${result.id}` : null,
    message: 'Uploaded to your Page.',
  };
}

// ---------------- Instagram ----------------
// Two-step: create a media container from a public video URL, then publish it.
// NOTE: Instagram's container API needs a URL it can fetch the video FROM —
// it does not accept a raw file upload. videoPublicUrl must be a URL your
// backend serves (see server.js's /media/:id static route) that Instagram's
// servers can reach — your backend's deployed URL must be public HTTPS.
async function publishInstagram({ videoPublicUrl, caption, accessToken }) {
  const pagesResp = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
  );
  if (!pagesResp.ok) return { ok: false, message: `Instagram: couldn't list pages (${await pagesResp.text()})` };
  const pagesData = await pagesResp.json();
  const igAccount = (pagesData.data || []).find(p => p.instagram_business_account);
  if (!igAccount) return { ok: false, message: 'Instagram: no linked Business account found' };
  const igId = igAccount.instagram_business_account.id;

  // Step 1: create container
  const containerResp = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_url: videoPublicUrl,
      caption: caption || '',
      media_type: 'REELS',
      access_token: accessToken,
    }),
  });
  if (!containerResp.ok) return { ok: false, message: `Instagram container failed: ${await containerResp.text()}` };
  const containerData = await containerResp.json();
  const creationId = containerData.id;
  if (!creationId) return { ok: false, message: 'Instagram did not return a container id' };

  // Step 2: poll until processing finishes (video containers process async)
  let statusCode = 'IN_PROGRESS';
  let attempts = 0;
  while (statusCode === 'IN_PROGRESS' && attempts < 30) {
    await new Promise(r => setTimeout(r, 4000));
    const statusResp = await fetch(
      `https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`
    );
    if (statusResp.ok) {
      const statusData = await statusResp.json();
      statusCode = statusData.status_code;
    }
    attempts++;
  }

  if (statusCode !== 'FINISHED') {
    return { ok: false, message: `Instagram video processing did not finish in time (last status: ${statusCode})` };
  }

  // Step 3: publish
  const publishResp = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
  });
  if (!publishResp.ok) return { ok: false, message: `Instagram publish failed: ${await publishResp.text()}` };
  const publishData = await publishResp.json();

  return {
    ok: true,
    remoteId: publishData.id,
    permalink: null, // Instagram doesn't return a permalink directly from media_publish
    message: 'Published as a Reel.',
  };
}

// ---------------- TikTok ----------------
// Content Posting API — direct post via PULL_FROM_URL, same public-URL
// requirement as Instagram above.
async function publishTikTok({ videoPublicUrl, caption, accessToken }) {
  const initResp = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      post_info: {
        title: (caption || '').slice(0, 150),
        privacy_level: 'SELF_ONLY', // stays private until your app passes Content Audit — see README
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoPublicUrl,
      },
    }),
  });

  if (!initResp.ok) {
    return { ok: false, message: `TikTok init failed: ${await initResp.text()}` };
  }

  const initData = await initResp.json();
  const publishId = initData.data && initData.data.publish_id;

  return {
    ok: true,
    remoteId: publishId || null,
    permalink: null, // TikTok issues the share URL asynchronously; check status separately if needed
    message: 'Submitted — visible only to you until your app passes TikTok\'s Content Audit.',
  };
}

module.exports = {
  publishYouTube,
  publishFacebook,
  publishInstagram,
  publishTikTok,
};
