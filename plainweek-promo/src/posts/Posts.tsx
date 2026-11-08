import {AbsoluteFill} from 'remotion';
import {CalendarIcon, ClockIcon, Sparkle} from '../components/Icons';
import {Phone} from '../components/Phone';
import {loadFonts} from '../fonts';
import {LogoMark} from '../launch/scenes/Hero';
import {DISPLAY, UI} from '../launch/theme';
import {KidDay} from '../family/screens/Kid';
import {FamilyHub, HubState, MumLock} from '../family/screens/Parent';
import {NextWeek, ThisWeek} from '../reset/screens/Screens';
import {C} from '../reset/theme';

loadFonts();

// Instagram feed posts, 1080×1350 (4:5).

/** Post 1 — the speedrun result as a poster. */
export const PostSpeedrun: React.FC = () => (
  <AbsoluteFill style={{background: C.stage, overflow: 'hidden', fontFamily: DISPLAY}}>
    <AbsoluteFill style={{background: 'radial-gradient(60% 34% at 50% 30%, rgba(218,122,68,0.38) 0%, rgba(218,122,68,0) 70%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(60% 40% at 50% 100%, rgba(218,122,68,0.22) 0%, rgba(218,122,68,0) 70%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 64, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
      <LogoMark size={58} ring={0.78} />
      <span style={{fontSize: 50, fontWeight: 700, letterSpacing: -1.8, color: '#F6F1EA'}}>Plainweek</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 176, textAlign: 'center', fontSize: 54, fontWeight: 700, letterSpacing: -1.8, color: '#F6F1EA'}}>
      Next week, fully planned in
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center'}}>
      <span style={{fontSize: 300, fontWeight: 700, letterSpacing: -14, lineHeight: 1, color: C.orange, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 90px rgba(218,122,68,0.55)'}}>2:41</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
      <span style={{fontSize: 26, fontWeight: 700, letterSpacing: 2, color: C.stage, background: C.orange, padding: '8px 16px', borderRadius: 12}}>WEEKLY RESET</span>
      <span style={{fontSize: 38, fontWeight: 500, color: '#A39A8F', letterSpacing: -0.4}}>Every Sunday. Under 3 minutes.</span>
    </div>
    <div style={{position: 'absolute', left: (1080 - 600 * 0.8) / 2, top: 660, transform: 'scale(0.8)', transformOrigin: 'top left'}}>
      <Phone width={600}>
        <NextWeek f={200} />
      </Phone>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 220, background: 'linear-gradient(180deg, rgba(20,18,16,0) 0%, rgba(20,18,16,0.95) 70%)'}} />
  </AbsoluteFill>
);

/** Post 2 — calm brand post: real week view + plain-English task entry. */
export const PostCalm: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF8F3 0%, #F6EDE2 60%, #F1DFCB 100%)', overflow: 'hidden', fontFamily: DISPLAY, color: '#1F1D1A'}}>
    <AbsoluteFill style={{background: 'radial-gradient(55% 30% at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(60% 40% at 70% 100%, rgba(218,122,68,0.25) 0%, rgba(218,122,68,0) 70%)'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 86}}>
      <div style={{fontSize: 108, fontWeight: 700, letterSpacing: -4.5, lineHeight: 1.0}}>
        Your week,
        <br />
        finally <span style={{color: C.orange}}>calm.</span>
      </div>
      <div style={{marginTop: 26, fontSize: 38, fontWeight: 500, letterSpacing: -0.6, color: '#6F685F', lineHeight: 1.3}}>
        The minimalist weekly planner
        <br />
        for iPhone.
      </div>
    </div>
    <div style={{position: 'absolute', left: 470, top: 470, transform: 'rotate(-4deg) scale(0.86)', transformOrigin: 'top left', filter: 'drop-shadow(0 40px 60px rgba(90,60,30,0.25))'}}>
      <Phone width={600}>
        <ThisWeek />
      </Phone>
    </div>
    {/* plain-English entry card */}
    <div style={{position: 'absolute', left: 64, top: 640, width: 520, borderRadius: 34, background: '#fff', padding: '26px 28px', boxShadow: '0 30px 60px rgba(90,60,30,0.2)', fontFamily: UI}}>
      <div style={{fontSize: 22, fontWeight: 600, letterSpacing: 2.4, color: C.sub}}>JUST TYPE IT</div>
      <div style={{marginTop: 14, height: 76, borderRadius: 38, background: '#F3F0EC', display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px', fontSize: 32, color: '#1F1D1A', boxShadow: '0 0 0 2.5px rgba(218,122,68,0.7)'}}>
        <span style={{fontSize: 40, fontWeight: 300}}>+</span>
        Call Josh <span style={{color: C.orange, background: C.orangeSoft, borderRadius: 8, padding: '0 6px'}}>fri</span>
        <span style={{color: C.orange, background: C.orangeSoft, borderRadius: 8, padding: '0 6px', marginLeft: -6}}>3pm</span>
      </div>
      <div style={{display: 'flex', gap: 12, marginTop: 18}}>
        {[
          [<CalendarIcon key="c" size={24} color={C.orange} />, 'Fri 13 Nov'],
          [<ClockIcon key="k" size={24} color={C.orange} />, '15:00'],
        ].map(([icon, label], i) => (
          <span key={i} style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 700, color: C.orange, background: C.orangeSoft, padding: '10px 18px', borderRadius: 18}}>
            {icon}
            {label}
          </span>
        ))}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, fontSize: 25, color: C.sub}}>
        <Sparkle size={20} color={C.orange} /> Understood. Added to Friday.
      </div>
    </div>
    <div style={{position: 'absolute', left: 64, top: 1080, display: 'flex', alignItems: 'center', gap: 16}}>
      <LogoMark size={70} ring={0.78} />
      <span style={{fontSize: 60, fontWeight: 700, letterSpacing: -2.2}}>Plainweek</span>
    </div>
    <div style={{position: 'absolute', left: 64, top: 1176, fontSize: 30, fontWeight: 500, color: '#6F685F'}}>Free on the App Store</div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Post 3 — Family Mode on full-bleed orange.
const HUB: HubState = {
  rings: {mum: 5 / 6, dad: 3 / 4, ava: 3 / 4, leo: 2 / 3},
  stars: {mum: 0, dad: 0, ava: 15, leo: 9},
  highlight: {id: 'ava', k: 1, text: 'Tidy your room ✓ +3 stars'},
};

export const PostFamily: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(160deg, #E58C58 0%, #DA7A44 45%, #C9642C 100%)', overflow: 'hidden', fontFamily: DISPLAY}}>
    <AbsoluteFill style={{background: 'radial-gradient(60% 40% at 20% 10%, rgba(255,235,215,0.35) 0%, rgba(255,235,215,0) 70%)'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 80}}>
      <div style={{fontSize: 26, fontWeight: 700, letterSpacing: 6, color: 'rgba(255,245,235,0.85)'}}>PLAINWEEK PRO · FAMILY MODE</div>
      <div style={{marginTop: 22, fontSize: 112, fontWeight: 700, letterSpacing: -4.8, lineHeight: 0.98, color: '#FFF6EC'}}>
        One home.
        <br />
        One plan.
        <br />
        <span style={{color: '#2A1A10'}}>A happier family.</span>
      </div>
    </div>
    <div style={{position: 'absolute', left: 70, top: 560, transform: 'rotate(-6deg) scale(0.62)', transformOrigin: 'top left', filter: 'drop-shadow(0 40px 50px rgba(80,30,5,0.35))'}}>
      <Phone width={600}>
        <FamilyHub s={HUB} />
      </Phone>
    </div>
    <div style={{position: 'absolute', left: 640, top: 600, transform: 'rotate(6deg) scale(0.62)', transformOrigin: 'top left', filter: 'drop-shadow(0 40px 50px rgba(80,30,5,0.35))'}}>
      <Phone width={600}>
        <KidDay f={140} />
      </Phone>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 486, display: 'flex', justifyContent: 'center'}}>
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 30px', borderRadius: 40, background: '#fff', boxShadow: '0 16px 36px rgba(80,30,5,0.3)', fontFamily: UI, fontSize: 32, fontWeight: 700, color: '#1F1D1A'}}>
        <span style={{width: 16, height: 16, borderRadius: 8, background: '#3FAE6E', boxShadow: '0 0 0 6px rgba(63,174,110,0.2)'}} />
        Synced instantly
      </span>
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Post 4 — Before / After split.
const NOTES: {x: number; y: number; r: number; text: string; color: string}[] = [
  {x: 30, y: 210, r: -8, text: 'Bins out??', color: '#F6E39A'},
  {x: 330, y: 250, r: 7, text: 'Dentist 2:30!!', color: '#F7C6C0'},
  {x: 20, y: 640, r: 6, text: 'call mum back', color: '#C9DDF5'},
  {x: 340, y: 760, r: -9, text: 'PAY RENT', color: '#F6E39A'},
  {x: 50, y: 900, r: -4, text: 'permission slip?', color: '#CFE6C4'},
];

export const PostBeforeAfter: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden', fontFamily: DISPLAY}}>
    {/* before */}
    <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1130, background: 'linear-gradient(180deg, #2B2724 0%, #1C1916 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 80, top: 330, transform: 'rotate(-5deg) scale(0.62)', transformOrigin: 'top left', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5)) saturate(0.85)'}}>
        <Phone width={600}>
          <MumLock f={140} />
        </Phone>
      </div>
      {NOTES.map((n, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: n.x,
            top: n.y,
            width: 190,
            minHeight: 150,
            padding: '26px 20px 16px',
            background: n.color,
            transform: `rotate(${n.r}deg)`,
            boxShadow: '0 14px 26px rgba(0,0,0,0.35)',
            fontFamily: '"Instrument Serif", serif',
            fontStyle: 'italic',
            fontSize: 36,
            lineHeight: '38px',
            color: '#3E352B',
            boxSizing: 'border-box',
          }}
        >
          <div style={{position: 'absolute', left: '50%', top: -10, width: 22, height: 22, marginLeft: -11, borderRadius: 11, background: '#C9573E'}} />
          {n.text}
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 40, fontWeight: 700, letterSpacing: 8, color: '#E9DFD3'}}>BEFORE</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', fontSize: 28, fontWeight: 500, color: '#9A9086'}}>notes, pings, panic</div>
    </div>
    {/* after */}
    <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1130, background: 'linear-gradient(180deg, #FBF8F3 0%, #F4EADF 100%)', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 40% at 50% 60%, rgba(218,122,68,0.18) 0%, rgba(218,122,68,0) 70%)'}} />
      <div style={{position: 'absolute', left: 84, top: 230, transform: 'scale(0.62)', transformOrigin: 'top left', filter: 'drop-shadow(0 30px 40px rgba(90,60,30,0.25))'}}>
        <Phone width={600}>
          <NextWeek f={200} />
        </Phone>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 40, fontWeight: 700, letterSpacing: 8, color: '#1F1D1A'}}>AFTER</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', fontSize: 28, fontWeight: 500, color: '#8C867E'}}>one calm week</div>
    </div>
    {/* divider */}
    <div style={{position: 'absolute', left: 538, top: 0, width: 4, height: 1130, background: C.orange}} />
    <div style={{position: 'absolute', left: 500, top: 520, width: 80, height: 80, borderRadius: 40, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(0,0,0,0.3)'}}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h13M13 6l6 6-6 6" />
      </svg>
    </div>
    {/* footer */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1130, height: 220, background: '#141210', display: 'flex', alignItems: 'center', padding: '0 70px', gap: 22}}>
      <LogoMark size={88} ring={0.78} />
      <div>
        <div style={{fontSize: 58, fontWeight: 700, letterSpacing: -2.2, color: '#F6F1EA'}}>Same week. Less chaos.</div>
        <div style={{fontSize: 30, fontWeight: 500, color: '#A39A8F', marginTop: 4}}>Plainweek · the calm weekly planner for iPhone</div>
      </div>
    </div>
  </AbsoluteFill>
);
