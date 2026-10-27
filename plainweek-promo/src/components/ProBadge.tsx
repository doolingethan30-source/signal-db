import {Sparkle} from './Icons';
import {C} from '../theme';

export const ProBadge: React.FC<{dark?: boolean}> = ({dark}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1.4,
      padding: '4px 8px',
      borderRadius: 8,
      color: dark ? C.paper : C.sageDeep,
      background: dark ? C.ink : C.sageSoft,
    }}
  >
    <Sparkle size={9} color={dark ? C.sage : C.sageDeep} />
    PRO
  </span>
);
