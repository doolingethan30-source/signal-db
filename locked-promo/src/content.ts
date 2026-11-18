/**
 * ─────────────────────────────────────────────────────────────
 *  LOCKED promo: ALL ON-SCREEN TEXT LIVES HERE
 * ─────────────────────────────────────────────────────────────
 *  Edit any string below, then re-render with:
 *
 *      npm run render
 *
 *  You don't need to touch any animation code to change wording.
 *  Tip: keep lines roughly the same length as the originals so
 *  they still fit the 1080px-wide vertical frame.
 */

export const content = {
  brand: {
    mark: '//',
    wordmark: 'LOCKED', // spaced out automatically → "L O C K E D"
  },

  // Scene 1 (0–3s): typed hook
  scene1: {
    line: 'You picked up your phone 96 times today.',
    // This part of the line gets the yellow accent (must appear in `line`)
    accent: '96',
  },

  // Scene 2 (3–7s): notification montage. Generic apps only, no real logos.
  // icon: 'heart' | 'play' | 'chat' | 'bell' | 'camera' | 'bolt'
  scene2: {
    notifications: [
      {app: 'Feed', icon: 'heart', color: '#E0457B', title: 'maya.k liked your photo', time: 'now'},
      {app: 'Clips', icon: 'play', color: '#2BD4C8', title: 'You have 14 new videos in For You', time: 'now'},
      {app: 'Tube', icon: 'play', color: '#E5483B', title: 'New upload from a channel you follow', time: '1m'},
      {app: 'Chat', icon: 'chat', color: '#3FB950', title: '“are you up??”', time: '1m'},
      {app: 'Feed', icon: 'heart', color: '#E0457B', title: '23 people liked your story', time: '2m'},
      {app: 'Snap', icon: 'camera', color: '#E9C23B', title: 'Your streak is about to end', time: '2m'},
      {app: 'Clips', icon: 'play', color: '#2BD4C8', title: 'Trending: you won’t believe this', time: '3m'},
      {app: 'News', icon: 'bolt', color: '#4C7BF4', title: 'Breaking: 5 things you missed', time: '3m'},
      {app: 'Chat', icon: 'chat', color: '#3FB950', title: '9 new messages in “weekend”', time: '4m'},
      {app: 'Tube', icon: 'play', color: '#E5483B', title: 'Live now: don’t miss it', time: '4m'},
      {app: 'Feed', icon: 'bell', color: '#A05CF0', title: 'You have new followers', time: '5m'},
      {app: 'Clips', icon: 'play', color: '#2BD4C8', title: 'Someone mentioned you', time: '5m'},
      {app: 'Snap', icon: 'camera', color: '#E9C23B', title: '3 new snaps', time: '6m'},
      {app: 'Feed', icon: 'heart', color: '#E0457B', title: 'jay_r commented: “lol”', time: '6m'},
    ],
    // Small caption shown when the stack freezes
    freezeCaption: 'Every buzz. Every scroll. Every day.',
  },

  // Scene 3 (7–11s): headline slam
  scene3: {
    headline: 'What if someone held you accountable?',
    accentWord: 'accountable?',
  },

  // Scene 4 (11–16s): home screen in the phone mockup
  homeScreen: {
    statusTime: '9:41',
    greeting: 'Good evening',
    title: 'Today',
    allowanceLabel: "Today's Allowance",
    usedMinutes: 72, // 1h 12m
    limitMinutes: 90, // 1h 30m
    ofLabel: 'of', // "of 1h 30m"
    leftLabel: 'left',
    tiles: [
      {label: 'Usage', value: '1h 12m', sub: 'across 9 apps'},
      {label: 'Lockouts', value: '3', sub: 'this week'},
      {label: 'Streak', value: '12 days', sub: 'personal best'},
    ],
    partnerLine: 'Partner: Sam holds your code',
    filterLine: 'Adult content filter',
    filterStatus: 'ON',
  },

  // Scene 5 (16–21s): limit reached + lockout
  lockout: {
    limitReached: 'Limit reached',
    title: 'LOCKED',
    message: 'Your limit is up. Your partner has the code.',
    codeLabel: 'Enter unlock code',
    codeLength: 6,
  },

  // Scene 5B (~20–24s): adult content blocking
  adultBlock: {
    browserPlaceholder: 'Search or enter website',
    blockedTitle: 'Blocked',
    blockedMessage: 'Adult content is filtered on this phone.',
    blockedSub: 'Turning it off needs your partner.',
    headline: 'Blocks adult content.',
    accentWord: 'adult content.',
    subline: 'Websites. Search. Risky apps.',
  },

  // Scene 6 (21–26s): feature lines (the yellow "//" is added automatically)
  scene6: {
    features: [
      'One daily limit across all your apps',
      'Your accountability partner holds the unlock code',
      'Built for discipline, not willpower',
    ],
  },

  // Scene 7 (26–30s): logo reveal + CTA
  scene7: {
    tagline: 'Coming to the App Store this December.',
    cta: 'Comment LOCKED to get early access.',
  },
} as const;

export type IconName = 'heart' | 'play' | 'chat' | 'bell' | 'camera' | 'bolt';
