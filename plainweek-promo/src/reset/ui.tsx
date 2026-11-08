import {Chevron} from '../components/Icons';
import {Ring} from '../components/Ring';
import {LIGHT_THEME, UI} from '../launch/theme';
import {Status} from '../launch/ui';
import {C} from './theme';

export const ui = UI;
export const PhoneStatus: React.FC = () => <Status t={LIGHT_THEME} />;

const stroke = {fill: 'none', stroke: C.ink, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

export const IconInbox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <path d="M4 13.5 6.5 5h11l2.5 8.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
    <path d="M4 13.5h4.5l1 2.5h5l1-2.5H20" />
  </svg>
);
export const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} strokeWidth={2}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5" />
  </svg>
);
export const IconReset: React.FC<{color?: string; size?: number}> = ({color = C.orange, size = 22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M15.5 9.2A4.3 4.3 0 1 0 16.3 13" />
    <path d="M15.8 6.8v2.6h-2.6" />
  </svg>
);
export const IconCarry: React.FC<{color?: string}> = ({color = C.orange}) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round">
    <path d="M14 5l7 6-7 6v-3.5c-5 0-8.5 1.5-11 5 1-5.5 4-9.5 11-10.5Z" />
  </svg>
);

export const CircleBtn: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{width: 38, height: 38, borderRadius: 19, background: '#EFEBE6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);

export const Header: React.FC<{icons?: boolean}> = ({icons = true}) => (
  <div style={{position: 'absolute', left: 18, right: 14, top: 70, display: 'flex', alignItems: 'center', fontFamily: UI, color: C.ink}}>
    <span style={{fontSize: 22, fontWeight: 600, letterSpacing: -0.6, whiteSpace: 'nowrap'}}>November 2026</span>
    <span style={{marginLeft: 8, marginTop: 3}}>
      <Chevron size={12} dir="down" color={C.ink} />
    </span>
    <div style={{marginLeft: 'auto', display: 'flex', gap: 6}}>
      {icons && (
        <>
          <CircleBtn>
            <IconInbox />
          </CircleBtn>
          <CircleBtn>
            <IconSearch />
          </CircleBtn>
        </>
      )}
      <CircleBtn>
        <Chevron size={14} dir="left" color={C.ink} />
      </CircleBtn>
      <CircleBtn>
        <Chevron size={14} dir="right" color={C.ink} />
      </CircleBtn>
    </div>
  </div>
);

export const DayCard: React.FC<{
  name: string;
  date: string;
  done: number;
  total: number;
  today?: boolean;
  heavy?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({name, date, done, total, today, heavy = 0, glow = 0, style}) => (
  <div
    style={{
      height: 60,
      borderRadius: 26,
      background: today ? 'linear-gradient(100deg, #F7E3D6 0%, #F3ECE6 70%)' : C.card,
      border: '1px solid rgba(255,255,255,0.7)',
      boxShadow: heavy > 0.01 ? `0 0 0 ${2 * heavy}px rgba(217,83,79,${0.75 * heavy})` : glow > 0.01 ? `0 0 0 ${2 * glow}px rgba(218,122,68,${0.8 * glow}), 0 10px 22px rgba(218,122,68,${0.2 * glow})` : '0 1px 2px rgba(0,0,0,0.03)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 18px 0 18px',
      boxSizing: 'border-box',
      fontFamily: UI,
      ...style,
    }}
  >
    <div>
      <div style={{fontSize: 15, fontWeight: 700, letterSpacing: 0.6, color: today ? C.ink : C.label}}>{name}</div>
      <div style={{fontSize: 12.5, color: C.sub, marginTop: 2, letterSpacing: 0.2}}>{date}</div>
    </div>
    {heavy > 0.3 && <span style={{marginLeft: 10, fontSize: 11, fontWeight: 700, color: C.heavy, background: '#FBE3E2', padding: '3px 8px', borderRadius: 8}}>Heavy</span>}
    <span style={{marginLeft: 'auto', fontSize: 13.5, color: C.label, fontVariantNumeric: 'tabular-nums', marginRight: 12}}>
      {Math.round(done)} / {Math.round(total)}
    </span>
    <Ring size={30} stroke={3.4} value={total ? done / total : 0} color={C.orange} track={C.track} />
    <span style={{marginLeft: 14}}>
      <Chevron size={12} color={C.label} />
    </span>
  </div>
);

const tabIcon = (name: string, color: string) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  switch (name) {
    case 'week':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...p}>
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
          {[0, 1, 2, 3].map((i) => [0, 1].map((j) => <circle key={`${i}${j}`} cx={7.5 + i * 3} cy={13 + j * 3.3} r={0.6} fill={color} stroke="none" />))}
        </svg>
      );
    case 'month':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...p}>
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
          <text x="12" y="17.6" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={color} stroke="none" fontFamily="Inter">31</text>
        </svg>
      );
    case 'layers':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...p}>
          <path d="M12 4 3.5 8.5 12 13l8.5-4.5Z" />
          <path d="M3.5 12.5 12 17l8.5-4.5M3.5 16 12 20.5 20.5 16" />
        </svg>
      );
    case 'family':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...p}>
          <circle cx="9" cy="8.5" r="3" />
          <circle cx="16.5" cy="8.5" r="2.5" />
          <path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5M14.5 14.2c.6-.2 1.3-.3 2-.3 2.3 0 4 1.5 4.5 4.3" />
        </svg>
      );
    default:
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5l1.6 2.3 2.8-.6.5 2.8 2.5 1.2-1 2.6 1.5 2.4-2.4 1.4v2.8l-2.8.2-1.4 2.4-2.4-1.3-2.4 1.3-1.4-2.4-2.8-.2v-2.8L3.6 14.2l1.5-2.4-1-2.6 2.5-1.2.5-2.8 2.8.6Z" />
        </svg>
      );
  }
};

/** Floating tab bar with the raised orange button over the active tab. */
export const TabBar: React.FC<{active: 'week' | 'month' | 'family'}> = ({active}) => {
  const tabs = ['week', 'month', 'layers', 'family', 'settings'];
  const xs = [64, 140, 216, 292, 368].map((x) => x - 23);
  const ai = tabs.indexOf(active);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, zIndex: 20}}>
      <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, height: 64, borderRadius: 32, background: '#fff', boxShadow: '0 10px 30px rgba(40,30,20,0.12)'}} />
      {tabs.map((t, i) =>
        i === ai ? null : (
          <div key={t} style={{position: 'absolute', left: xs[i] - 13, bottom: 32, width: 26, height: 26}}>
            {tabIcon(t, '#6E6862')}
          </div>
        ),
      )}
      <div
        style={{
          position: 'absolute',
          left: xs[ai] - 30,
          bottom: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          background: 'linear-gradient(160deg, #E58C58 0%, #D46F37 100%)',
          boxShadow: '0 10px 22px rgba(212,111,55,0.4), inset 0 1px 0 rgba(255,255,255,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {tabIcon(active, '#fff')}
      </div>
    </div>
  );
};
