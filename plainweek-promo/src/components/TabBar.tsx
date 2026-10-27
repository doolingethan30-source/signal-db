import {A, SANS} from '../theme';

const Icon: React.FC<{name: string; color: string}> = ({name, color}) => {
  switch (name) {
    case 'Week':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" fill={color} />
          <path d="M3.5 9.5 H20.5" stroke="#fff" strokeWidth="1.4" />
          <path d="M8 3 V6.5 M16 3 V6.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={7 + i * 4} y="13" width="2" height="2" rx="0.6" fill="#fff" />
          ))}
        </svg>
      );
    case 'Calendar':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M3.5 9.5 H20.5 M8 3 V6.5 M16 3 V6.5" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={7 + i * 4} y="13" width="1.6" height="1.6" fill={color} stroke="none" />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={`b${i}`} x={7 + i * 4} y="16.4" width="1.6" height="1.6" fill={color} stroke="none" />
          ))}
        </svg>
      );
    case 'Stats':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 20 V12 M12 20 V5 M18 20 V9" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.8 L13.6 5.2 L16.4 4.6 L17 7.4 L19.6 8.6 L18.6 11.2 L20.2 13.6 L17.8 15.2 L17.8 18 L15 18.2 L13.4 20.6 L11 19.2 L8.4 20.4 L7.4 17.8 L4.6 17.2 L5.4 14.4 L3.8 12 L5.8 10 L5.2 7.2 L8 6.6 L9.4 4.2 Z" strokeLinejoin="round" />
        </svg>
      );
  }
};

export const TabBar: React.FC<{active?: string}> = ({active = 'Week'}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 92,
      background: 'rgba(250,248,245,0.96)',
      borderTop: `1px solid ${A.line}`,
      display: 'flex',
      justifyContent: 'space-around',
      paddingTop: 10,
      boxSizing: 'border-box',
      fontFamily: SANS,
      zIndex: 4,
    }}
  >
    {['Week', 'Calendar', 'Stats', 'Settings'].map((name) => {
      const color = name === active ? A.orange : '#4A4743';
      return (
        <div key={name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 70}}>
          <Icon name={name} color={color} />
          <span style={{fontSize: 11, color, fontWeight: name === active ? 600 : 500}}>{name}</span>
        </div>
      );
    })}
  </div>
);
