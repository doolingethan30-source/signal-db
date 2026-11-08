import {AbsoluteFill} from 'remotion';
import {CalendarIcon, ClockIcon, Sparkle} from '../components/Icons';
import {Phone} from '../components/Phone';
import {loadFonts} from '../fonts';
import {LogoMark} from '../launch/scenes/Hero';
import {DISPLAY, UI} from '../launch/theme';
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
