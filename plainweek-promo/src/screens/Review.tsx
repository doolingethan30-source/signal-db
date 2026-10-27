import {interpolate} from 'remotion';
import {prog} from '../anim';
import {Leaf, Sparkle} from '../components/Icons';
import {StatusBar} from '../components/Phone';
import {ProBadge} from '../components/ProBadge';
import {Ring} from '../components/Ring';
import {A, SANS} from '../theme';

const BARS = [1, 1, 0.67, 1, 0.8, 1, 0.75];

export const Review: React.FC<{f: number}> = ({f}) => {
  const r = prog(f, 6, 34);
  const pct = Math.round(88 * r);
  return (
    <div style={{position: 'absolute', inset: 0, background: A.bg, fontFamily: SANS}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 24, top: 62, right: 24}}>
        <ProBadge />
        <div style={{fontSize: 28, fontWeight: 700, letterSpacing: -0.5, lineHeight: '36px', marginTop: 8}}>Sunday review</div>
        <div style={{fontSize: 13, color: A.sub, marginTop: 2}}>Week of Oct 26 · a good one.</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 180,
          height: 196,
          borderRadius: 24,
          background: '#FBFAF8',
          border: `1px solid ${A.line}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px',
          boxSizing: 'border-box',
          gap: 22,
        }}
      >
        <Ring size={136} stroke={11} value={0.88 * r}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 34, fontWeight: 700, letterSpacing: -1, lineHeight: '40px', fontVariantNumeric: 'tabular-nums'}}>{pct}%</div>
            <div style={{fontSize: 10, color: A.sub, letterSpacing: 1, fontWeight: 600, marginTop: 2}}>COMPLETE</div>
          </div>
        </Ring>
        <div>
          <div style={{fontSize: 30, fontWeight: 600, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums'}}>
            {Math.round(23 * r)}
            <span style={{color: A.sub, fontWeight: 500}}>/26</span>
          </div>
          <div style={{fontSize: 13, color: A.sub, marginTop: 2}}>tasks done</div>
          <div style={{fontSize: 30, fontWeight: 600, letterSpacing: -0.6, marginTop: 12}}>
            {Math.round(21 * r)}
          </div>
          <div style={{fontSize: 13, color: A.sub, marginTop: 2}}>day best streak</div>
        </div>
      </div>
      {/* bars */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 394,
          height: 170,
          borderRadius: 24,
          background: '#FBFAF8',
          border: `1px solid ${A.line}`,
          padding: '16px 22px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{fontSize: 12, fontWeight: 600, color: A.sub, letterSpacing: 1}}>DAY BY DAY</div>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 96, marginTop: 10}}>
          {BARS.map((b, i) => {
            const g = prog(f, 10 + i * 3, 18);
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                <div
                  style={{
                    width: 26,
                    height: 76 * b * g + 4,
                    borderRadius: 8,
                    background: b === 1 ? A.orange : A.orangeSoft,
                  }}
                />
                <span style={{fontSize: 10, color: A.sub, fontWeight: 600}}>{'MTWTFSS'[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* insights */}
      {[
        {icon: <Sparkle size={13} color={A.orange} />, text: 'Mornings are your focus time — protect them.'},
        {icon: <Leaf size={13} />, text: '3 tasks carried over to next week.'},
      ].map((row, i) => {
        const a = prog(f, 26 + i * 6, 12);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              top: 582 + i * 58,
              height: 48,
              borderRadius: 16,
              background: '#FBEFE7',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 16px',
              fontSize: 13.5,
              color: A.ink,
              opacity: a,
              transform: `translateY(${(1 - a) * 14}px)`,
            }}
          >
            {row.icon}
            {row.text}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 716,
          height: 52,
          borderRadius: 18,
          background: A.orange,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          fontWeight: 600,
          opacity: interpolate(f, [36, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        Plan next week →
      </div>
    </div>
  );
};
