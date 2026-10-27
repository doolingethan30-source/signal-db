import {Sparkle} from './Icons';
import {A} from '../theme';

export const ProBadge: React.FC = () => (
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
      color: A.orange,
      background: A.orangeSoft,
    }}
  >
    <Sparkle size={9} color={A.orange} />
    PRO
  </span>
);
