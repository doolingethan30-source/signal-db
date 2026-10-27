import {C, SANS} from '../theme';

export const SCREEN_W = 393;
export const SCREEN_H = 852;

/**
 * iPhone mockup. Children are laid out in iOS points (393×852) and scaled
 * to fit the screen, so UI can be authored at native iOS sizes.
 */
export const Phone: React.FC<{width: number; children: React.ReactNode}> = ({width, children}) => {
  const bezel = width * 0.03;
  const screenW = width - bezel * 2;
  const scale = screenW / SCREEN_W;
  const screenH = SCREEN_H * scale;
  const radius = width * 0.16;
  return (
    <div style={{position: 'relative', width, height: screenH + bezel * 2}}>
      {/* side buttons */}
      {[
        {left: -3, top: 0.17, h: 0.045},
        {left: -3, top: 0.235, h: 0.075},
        {left: -3, top: 0.325, h: 0.075},
        {left: width - 1, top: 0.26, h: 0.11},
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            top: (screenH + bezel * 2) * b.top,
            width: 4,
            height: (screenH + bezel * 2) * b.h,
            borderRadius: 3,
            background: '#3A3936',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          background: 'linear-gradient(145deg, #4A4945 0%, #2A2927 35%, #1E1D1B 70%, #3B3A37 100%)',
          boxShadow: `0 60px 120px -30px rgba(52, 46, 36, 0.38), 0 30px 60px -20px rgba(52, 46, 36, 0.25), inset 0 0 0 1.5px rgba(255,255,255,0.12)`,
          padding: bezel,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: screenW,
            height: screenH,
            borderRadius: radius - bezel,
            overflow: 'hidden',
            background: C.paper,
            fontFamily: SANS,
            color: C.ink,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: SCREEN_W,
              height: SCREEN_H,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {children}
            {/* Dynamic Island */}
            <div
              style={{
                position: 'absolute',
                top: 11,
                left: SCREEN_W / 2 - 62,
                width: 124,
                height: 36,
                borderRadius: 20,
                background: '#0B0B0A',
                zIndex: 100,
              }}
            />
            {/* home indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: SCREEN_W / 2 - 68,
                width: 136,
                height: 5,
                borderRadius: 3,
                background: 'rgba(42,41,39,0.85)',
                zIndex: 100,
              }}
            />
          </div>
          {/* glass sheen */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const StatusBar: React.FC<{color?: string}> = ({color = C.ink}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 34px 0 46px',
      boxSizing: 'border-box',
      color,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 16,
      zIndex: 5,
    }}
  >
    <span>9:41</span>
    <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
      <svg width="18" height="11" viewBox="0 0 18 11">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.8} y={8 - i * 2.6} width="3" height={3 + i * 2.6} rx="0.8" fill={color} />
        ))}
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 12">
        <path d="M8 11 L5.6 8.4 A3.4 3.4 0 0 1 10.4 8.4 Z" fill={color} />
        <path d="M3.6 6.4 A6.2 6.2 0 0 1 12.4 6.4" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d="M1.2 3.9 A9.6 9.6 0 0 1 14.8 3.9" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke={color} strokeOpacity="0.45" fill="none" />
        <rect x="2.2" y="2.2" width="16" height="7.6" rx="1.8" fill={color} />
        <rect x="23.6" y="4" width="1.6" height="4" rx="0.8" fill={color} fillOpacity="0.45" />
      </svg>
    </div>
  </div>
);
