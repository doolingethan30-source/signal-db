/**
 * ─────────────────────────────────────────────────────────────
 *  LOCKED campaign film ("Don't fight alone"): ALL TEXT HERE
 * ─────────────────────────────────────────────────────────────
 *  Edit wording below, then re-render with:   npm run render:campaign
 */

export const campaign = {
  // Scene 1 (0–4.5s): the struggle
  s1: {
    line: 'Some battles happen in silence.',
  },

  // Scene 2 (4.5–9s): the reality
  s2: {
    line: 'What you consume matters.',
  },

  // Scene 3 (9–15s): take control
  s3: {
    headline: 'Block adult content.',
    subline: 'Protect your digital environment.',
    screenTitle: 'Protection',
    statusLabel: 'Protected',
    statusSub: 'Filtering is active on this phone',
    rows: [
      {label: 'Adult content filter', sub: 'Every browser'},
      {label: 'Strict mode', sub: 'Tighter filtering'},
      {label: 'SafeSearch', sub: 'Always enforced'},
      {label: 'High-risk apps', sub: 'Blocked'},
      {label: 'Install lock', sub: 'Weakening needs your partner'},
    ],
    blockedTitle: 'Access blocked',
    blockedMessage: 'This content is filtered to protect you.',
    blockedSub: 'Take a breath. You’re in control.',
  },

  // Scene 4 (15–26s): your partner is the gatekeeper
  s4: {
    headline: 'Your partner holds the key.',
    subline: 'Stronger anytime. Weaker needs them.',
    youLabel: 'You',
    partnerLabel: 'Sam · your partner',
    youName: 'Alex', // the user's name as it appears in partner emails
    partnerName: 'Sam',
    // Your phone
    screenTitle: 'Protection',
    protectionLabel: 'Protection',
    strictLabel: 'Strict mode',
    safeSearchLabel: 'SafeSearch',
    appliedToast: 'Applied instantly. Sam has been emailed.',
    sheetTitle: 'This needs Sam',
    sheetBody: 'Making protection weaker needs your partner’s one-time code.',
    askButton: 'Ask Sam',
    codeTitle: 'Enter Sam’s code',
    codeNote: 'Sam has been emailed a one-time code',
    // Sam's phone (email)
    inboxTitle: 'Inbox',
    emailFrom: 'LOCKED',
    strongerSubject: 'Alex made protection stronger',
    strongerBody: 'Strict mode was turned on. No action needed.',
    weakerSubject: 'Alex asked to turn protection off',
    weakerCode: '482 913',
    weakerBody: 'Valid for 48 hours. Only share it if you agree.',
    alertsTitle: 'Sam is also emailed if:',
    alerts: [
      'The filter is switched off in Settings',
      'Screen Time access is removed',
      'Your account signs in on a new device',
      'Premium ends or the account is deleted',
    ],
    // Captions under the phones
    captions: {
      stronger: 'Make it stronger: it applies instantly.',
      strongerSub: 'Your partner is emailed what changed.',
      weaker: 'Make it weaker: your partner gets a one-time code.',
      agree: 'If they agree, they share it.',
      nothing: 'Without the code, nothing changes.',
      alerts: 'Try to switch it off? Your partner is told.',
    },
  },

  // Scene 5 (26–33s): you are not alone
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
