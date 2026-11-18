/**
 * ─────────────────────────────────────────────────────────────
 *  LOCKED campaign film ("Don't fight alone"): ALL TEXT HERE
 * ─────────────────────────────────────────────────────────────
 *  Edit wording below, then re-render with:   npm run render:campaign
 */

export const campaign = {
  // Scene 1 (0–5s): the struggle
  s1: {
    line: 'Some battles happen in silence.',
  },

  // Scene 2 (5–10s): the reality
  s2: {
    line: 'What you consume matters.',
  },

  // Scene 3 (10–17s): take control
  s3: {
    headline: 'Block adult content.',
    subline: 'Protect your digital environment.',
    screenTitle: 'Protection',
    statusLabel: 'Protected',
    statusSub: 'Filtering is active on this phone',
    rows: [
      {label: 'Adult website blocking', sub: 'Every browser'},
      {label: 'Content restrictions', sub: 'Apps & search results'},
      {label: 'Safe search', sub: 'Always enforced'},
      {label: 'Partner lock', sub: 'Changes need your partner'},
    ],
    blockedTitle: 'Access blocked',
    blockedMessage: 'This content is filtered to protect you.',
    blockedSub: 'Take a breath. You’re in control.',
  },

  // Scene 4 (17–25s): accountability
  s4: {
    headline: 'Stay accountable.',
    subline: 'Find someone who helps you stay on track.',
    partnerName: 'Sam',
    youLabel: 'You',
    message: 'Hey, just checking in. Stay strong. You’ve got this.',
    connectedLabel: 'Accountability partner',
    connectedStatus: 'Connected',
    checkInTitle: 'Daily check-in',
    checkInButton: 'I’m staying on track',
    checkInDone: 'Checked in. Sam will see it.',
    progressLabel: 'Days committed',
    progressValue: 12,
    progressGoal: 30,
  },

  // Scene 5 (25–33s): you are not alone
  s5: {
    line: 'You don’t have to fight alone.',
  },

  // Scene 6 (33–40s): brand message + launch
  s6: {
    main: ['Take control.', 'Stay accountable.', 'Keep growing.'],
    supporting: 'Build better habits. Protect your mind. Don’t fight alone.',
    wordmark: 'LOCKED',
    launch: 'Coming to the App Store this December.',
  },
} as const;
