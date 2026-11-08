import {interpolateColors} from 'remotion';
import {Avatar} from '../../family/ui';
import {MATES} from '../theme';

// One apartment (2400×1920 scene units): kitchen on the left, lounge on the
// right. `mess` 0..1 swaps between the problem state and the clean ending;
// `day` 0..1 moves the light from a dim evening to a warm, golden morning.

export const SCENE_W = 2400;
export const SCENE_H = 1920;

const Plate: React.FC<{x: number; y: number; w?: number; tilt?: number; dirty?: boolean}> = ({x, y, w = 150, tilt = 0, dirty = true}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: w * 0.22, borderRadius: '50%', background: 'linear-gradient(180deg,#FDFBF7,#DCD6CC)', boxShadow: '0 4px 6px rgba(0,0,0,0.18)', transform: `rotate(${tilt}deg)`}}>
    {dirty && <div style={{position: 'absolute', left: '30%', top: '25%', width: '30%', height: '40%', borderRadius: '50%', background: 'rgba(170,110,60,0.55)'}} />}
  </div>
);

const Mug: React.FC<{x: number; y: number; c: string}> = ({x, y, c}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <div style={{width: 56, height: 62, borderRadius: '6px 6px 14px 14px', background: c, boxShadow: 'inset -6px 0 0 rgba(0,0,0,0.12)'}} />
    <div style={{position: 'absolute', left: 50, top: 14, width: 22, height: 28, borderRadius: 12, border: `7px solid ${c}`, boxSizing: 'border-box'}} />
  </div>
);

export const Apartment: React.FC<{mess: number; day: number; avatarsIn?: number; frame?: number}> = ({mess, day, avatarsIn = 0, frame = 0}) => {
  const wall = interpolateColors(day, [0, 1], ['#B9AFA3', '#F3E9DC']);
  const wall2 = interpolateColors(day, [0, 1], ['#A1968A', '#EADCCB']);
  const floor = interpolateColors(day, [0, 1], ['#7D6450', '#C9A27E']);
  const sky = interpolateColors(day, [0, 1], ['#2E3550', '#F9D9B5']);
  const clean = 1 - mess;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: SCENE_W, height: SCENE_H, background: `linear-gradient(180deg, ${wall} 0%, ${wall2} 78%)`, overflow: 'hidden'}}>
      {/* window with the city */}
      <div style={{position: 'absolute', left: 1040, top: 430, width: 380, height: 560, borderRadius: 12, border: '16px solid #F7F2EB', background: `linear-gradient(180deg, ${sky} 0%, ${interpolateColors(day, [0, 1], ['#4A4E6A', '#FBE7CF'])} 100%)`, overflow: 'hidden', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.15)'}}>
        {[60, 140, 210, 280].map((x, i) => (
          <div key={i} style={{position: 'absolute', left: x - 30, bottom: 0, width: 60 + (i % 2) * 20, height: 160 + ((i * 53) % 120), background: interpolateColors(day, [0, 1], ['#262A3E', '#E2C7AC'])}}>
            {Array.from({length: 6}).map((_, j) => (
              <div key={j} style={{position: 'absolute', left: 10 + (j % 2) * 26, top: 16 + Math.floor(j / 2) * 34, width: 14, height: 18, background: interpolateColors(day, [0, 1], ['#F2C46B', '#F4DCC2']), opacity: (i + j) % 3 ? 0.9 : 0.3}} />
            ))}
          </div>
        ))}
        <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 10, marginLeft: -5, background: '#F7F2EB'}} />
      </div>
      {/* light from the window */}
      <div style={{position: 'absolute', left: 900, top: 900, width: 900, height: 1100, background: `linear-gradient(160deg, rgba(255,226,180,${0.35 * day}) 0%, rgba(255,226,180,0) 60%)`, transform: 'skewX(-18deg)'}} />
      {/* floor */}
      <div style={{position: 'absolute', left: 0, top: 1500, width: SCENE_W, height: 420, background: `linear-gradient(180deg, ${floor}, ${interpolateColors(day, [0, 1], ['#5E4A3B', '#B38D69'])})`}}>
        {Array.from({length: 12}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: i * 210, top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.08)'}} />
        ))}
      </div>

      {/* ---------- kitchen ---------- */}
      <div style={{position: 'absolute', left: 40, top: 500, width: 680, height: 250, borderRadius: 10, background: '#E9E3DA', boxShadow: '0 10px 20px rgba(0,0,0,0.12)'}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 14 + i * 224, top: 14, width: 210, height: 222, borderRadius: 8, background: '#F3EEE7'}}>
            <div style={{position: 'absolute', left: 95, bottom: 18, width: 20, height: 6, borderRadius: 3, background: '#B9AE9F'}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 30, top: 1180, width: 720, height: 40, background: '#D8CFC3', borderRadius: 6}} />
      <div style={{position: 'absolute', left: 40, top: 1220, width: 700, height: 280, background: '#E9E3DA'}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 14 + i * 228, top: 14, width: 214, height: 252, borderRadius: 8, background: '#F3EEE7'}}>
            <div style={{position: 'absolute', left: 97, top: 20, width: 20, height: 6, borderRadius: 3, background: '#B9AE9F'}} />
          </div>
        ))}
      </div>
      {/* sink + tap */}
      <div style={{position: 'absolute', left: 250, top: 1178, width: 340, height: 18, borderRadius: 9, background: '#9FA3A6'}} />
      <div style={{position: 'absolute', left: 405, top: 1060, width: 18, height: 120, borderRadius: 9, background: '#AEB2B5'}} />
      <div style={{position: 'absolute', left: 405, top: 1052, width: 90, height: 18, borderRadius: 9, background: '#AEB2B5'}} />
      {/* the dish pile */}
      <div style={{opacity: mess}}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Plate key={i} x={265 + (i % 2) * 18} y={1160 - i * 26} tilt={(i % 2 ? 4 : -5) + i} />
        ))}
        {[0, 1, 2].map((i) => (
          <Plate key={`b${i}`} x={60 + i * 10} y={1162 - i * 24} w={130} tilt={i * 3 - 4} />
        ))}
        <Mug x={470} y={1112} c="#E8735A" />
        <Mug x={545} y={1118} c="#4A7FD4" />
        <Mug x={640} y={1118} c="#F2C46B" />
        <div style={{position: 'absolute', left: 150, top: 1090, width: 180, height: 50, borderRadius: '0 0 40px 40px', background: '#3B3836', transform: 'rotate(-14deg)'}}>
          <div style={{position: 'absolute', left: 170, top: 6, width: 150, height: 14, borderRadius: 7, background: '#3B3836'}} />
        </div>
        <div style={{position: 'absolute', left: 600, top: 1070, width: 110, height: 70, background: '#C48A4E', transform: 'rotate(8deg)', borderRadius: 6}} />
      </div>
      {/* clean kitchen: a plant and tidy jars */}
      <div style={{opacity: clean}}>
        <div style={{position: 'absolute', left: 90, top: 1090, width: 70, height: 90, borderRadius: '8px 8px 14px 14px', background: '#C9B7A3'}} />
        <div style={{position: 'absolute', left: 60, top: 980, width: 130, height: 130, borderRadius: '50%', background: '#7FA36E'}} />
        <div style={{position: 'absolute', left: 560, top: 1100, width: 46, height: 80, borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: '3px solid #D8CFC3'}} />
        <div style={{position: 'absolute', left: 620, top: 1115, width: 46, height: 65, borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: '3px solid #D8CFC3'}} />
      </div>
      {/* fridge */}
      <div style={{position: 'absolute', left: 780, top: 560, width: 230, height: 940, borderRadius: 18, background: 'linear-gradient(100deg,#F8F6F2,#DEDAD3)', boxShadow: '0 20px 40px rgba(0,0,0,0.18)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, height: 4, background: '#CFC9C0'}} />
        <div style={{position: 'absolute', right: 18, top: 120, width: 10, height: 160, borderRadius: 5, background: '#BDB5AA'}} />
        <div style={{position: 'absolute', right: 18, top: 380, width: 10, height: 220, borderRadius: 5, background: '#BDB5AA'}} />
        {/* the old paper rota */}
        <div style={{position: 'absolute', left: 26, top: 400, width: 150, height: 190, background: '#FFFDF6', transform: 'rotate(-4deg)', boxShadow: '0 6px 10px rgba(0,0,0,0.15)', padding: 12, boxSizing: 'border-box', fontFamily: 'Inter', fontSize: 14, color: '#5A4E40', opacity: 0.4 + 0.6 * mess}}>
          <div style={{position: 'absolute', left: '50%', top: -8, width: 16, height: 16, marginLeft: -8, borderRadius: 8, background: '#DA7A44'}} />
          <b>ROTA wk 2</b>
          {['dishes', 'bins', 'bathroom'].map((c) => (
            <div key={c} style={{marginTop: 8, textDecoration: 'line-through', textDecorationColor: '#C9573E'}}>{c}</div>
          ))}
        </div>
      </div>

      {/* ---------- lounge ---------- */}
      <div style={{position: 'absolute', left: 1560, top: 520, width: 230, height: 300, borderRadius: 8, background: '#E7D8C6', border: '12px solid #F7F2EB', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}>
        <div style={{position: 'absolute', inset: 30, borderRadius: '50%', background: 'radial-gradient(circle, #DA7A44 0%, #F2C46B 60%, rgba(0,0,0,0) 61%)'}} />
      </div>
      <div style={{position: 'absolute', left: 1830, top: 600, width: 180, height: 220, borderRadius: 8, background: '#D9E4D2', border: '12px solid #F7F2EB'}} />
      {/* rug */}
      <div style={{position: 'absolute', left: 1450, top: 1560, width: 860, height: 180, borderRadius: '50%', background: interpolateColors(day, [0, 1], ['#8E7A68', '#E8D2B8'])}} />
      {/* sofa */}
      <div style={{position: 'absolute', left: 1480, top: 1130, width: 820, height: 200, borderRadius: '50px 50px 20px 20px', background: '#5C6E7E'}} />
      <div style={{position: 'absolute', left: 1440, top: 1260, width: 900, height: 200, borderRadius: 40, background: '#6C8091'}} />
      <div style={{position: 'absolute', left: 1440, top: 1250, width: 110, height: 230, borderRadius: 40, background: '#5C6E7E'}} />
      <div style={{position: 'absolute', left: 2230, top: 1250, width: 110, height: 230, borderRadius: 40, background: '#5C6E7E'}} />
      <div style={{position: 'absolute', left: 1500, top: 1460, width: 20, height: 50, background: '#3E3530'}} />
      <div style={{position: 'absolute', left: 2280, top: 1460, width: 20, height: 50, background: '#3E3530'}} />
      {/* coffee table */}
      <div style={{position: 'absolute', left: 1660, top: 1560, width: 480, height: 36, borderRadius: 10, background: '#8B6A4E'}} />
      <div style={{position: 'absolute', left: 1690, top: 1596, width: 18, height: 90, background: '#6E523C'}} />
      <div style={{position: 'absolute', left: 2092, top: 1596, width: 18, height: 90, background: '#6E523C'}} />
      {/* lamp */}
      <div style={{position: 'absolute', left: 2330, top: 900, width: 8, height: 600, background: '#3E3530'}} />
      <div style={{position: 'absolute', left: 2250, top: 820, width: 170, height: 120, borderRadius: '40px 40px 10px 10px', background: '#F2D7AE', boxShadow: `0 60px 120px 40px rgba(255,214,150,${0.25 + 0.35 * day})`}} />
      {/* the mess */}
      <div style={{opacity: mess}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 1700 + i * 18, top: 1520 - i * 22, width: 230, height: 40, background: '#D9B48A', border: '3px solid #B88D5E', transform: `rotate(${i * 4 - 4}deg)`}}>
            <div style={{position: 'absolute', left: 80, top: 8, width: 60, height: 20, borderRadius: 4, background: '#C9573E', opacity: 0.7}} />
          </div>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <div key={`c${i}`} style={{position: 'absolute', left: 1990 + i * 34, top: i === 3 ? 1612 : 1500, width: 30, height: 60, borderRadius: 6, background: ['#C9573E', '#4A7FD4', '#3FAE6E', '#C9573E'][i], transform: i === 3 ? 'rotate(90deg)' : 'none'}} />
        ))}
        <div style={{position: 'absolute', left: 1560, top: 1180, width: 300, height: 120, borderRadius: '60px 60px 30px 30px', background: 'linear-gradient(135deg, #8EA6C9 0%, #E8735A 45%, #F2C46B 100%)', opacity: 0.9}} />
        <div style={{position: 'absolute', left: 1540, top: 1700, width: 160, height: 60, borderRadius: 30, background: '#7A8FA6', transform: 'rotate(-8deg)'}} />
        <div style={{position: 'absolute', left: 2200, top: 1690, width: 120, height: 40, borderRadius: 20, background: '#2E2B28'}} />
      </div>
      {/* the clean lounge: plant, candle, books */}
      <div style={{opacity: clean}}>
        <div style={{position: 'absolute', left: 1330, top: 1300, width: 90, height: 200, borderRadius: '10px 10px 30px 30px', background: '#C9B7A3'}} />
        <div style={{position: 'absolute', left: 1270, top: 1060, width: 210, height: 260, borderRadius: '50% 50% 45% 45%', background: '#7FA36E'}} />
        <div style={{position: 'absolute', left: 1760, top: 1510, width: 140, height: 50, borderRadius: 6, background: '#DA7A44'}} />
        <div style={{position: 'absolute', left: 1770, top: 1480, width: 120, height: 32, borderRadius: 6, background: '#4A7FD4'}} />
        <div style={{position: 'absolute', left: 1990, top: 1490, width: 46, height: 70, borderRadius: 10, background: '#F3EEE7'}} />
        <div style={{position: 'absolute', left: 2007, top: 1462, width: 12, height: 26, borderRadius: '50% 50% 40% 40%', background: '#F2C46B', boxShadow: '0 0 30px 12px rgba(242,196,107,0.6)'}} />
      </div>
      {/* the roommates, together on the sofa */}
      {MATES.map((m, i) => {
        const k = Math.max(0, Math.min(1, avatarsIn * 1.6 - i * 0.2));
        if (k <= 0) return null;
        return (
          <div key={m.id} style={{position: 'absolute', left: 1600 + i * 165, top: 1150 + Math.sin(frame / 14 + i) * 4, transform: `scale(${0.4 + 0.6 * k})`, opacity: k, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
            <div style={{border: '6px solid #fff', borderRadius: '50%', boxShadow: '0 12px 24px rgba(0,0,0,0.2)'}}>
              <Avatar m={{id: 'mum', name: m.name, initial: m.initial, color: m.color, role: ''}} size={120} />
            </div>
            <span style={{fontFamily: 'Inter', fontSize: 34, fontWeight: 700, color: '#2A2420', background: 'rgba(255,255,255,0.85)', padding: '4px 18px', borderRadius: 20}}>{m.name}</span>
          </div>
        );
      })}
    </div>
  );
};
