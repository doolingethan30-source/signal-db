import {C, SANS} from '../theme';

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

/** Minimal iOS-style keyboard. `active` lights up the key currently being typed. */
export const Keyboard: React.FC<{active?: string; pressT?: number}> = ({active, pressT = 0}) => {
  const key = (label: string, w: number, special = false) => {
    const on = active !== undefined && active.toLowerCase() === label;
    return (
      <div
        key={label}
        style={{
          width: w,
          height: 42,
          borderRadius: 6,
          background: on ? '#FFFFFF' : special ? '#C9C6BF' : '#FDFCFA',
          boxShadow: '0 1px 0 rgba(0,0,0,0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 21,
          fontFamily: SANS,
          color: C.ink,
          transform: on ? `translateY(${-6 * (1 - pressT)}px) scale(${1 + 0.25 * (1 - pressT)})` : 'none',
          zIndex: on ? 2 : 1,
          position: 'relative',
        }}
      >
        {label.length === 1 ? label : <span style={{fontSize: 15}}>{label}</span>}
      </div>
    );
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 290,
        background: '#DEDBD4',
        padding: '10px 3px 0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
      }}
    >
      {ROWS.map((row, r) => (
        <div key={row} style={{display: 'flex', justifyContent: 'center', gap: 6}}>
          {r === 2 && key('⇧', 44, true)}
          {r === 2 && <div style={{width: 6}} />}
          {row.split('').map((ch) => key(ch, 33))}
          {r === 2 && <div style={{width: 6}} />}
          {r === 2 && key('⌫', 44, true)}
        </div>
      ))}
      <div style={{display: 'flex', justifyContent: 'center', gap: 6}}>
        {key('123', 88, true)}
        {key(' ', 186)}
        {key('return', 88, true)}
      </div>
    </div>
  );
};
