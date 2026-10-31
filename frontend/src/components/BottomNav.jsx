import { CarGlyph, PersonGlyph } from '../icons';

const TABS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'activity', label: 'Rides', icon: (p) => <CarGlyph {...p} /> },
  { id: 'history', label: 'History', icon: HistoryIcon },
  { id: 'profile', label: 'Account', icon: (p) => <PersonGlyph {...p} /> },
];

export default function BottomNav({ active, onChange, ridesBadge }) {
  return (
    <nav className="sticky bottom-0 z-10 bg-ink border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {TABS.map((t) => {
          const isActive = active === t.id;
          const color = isActive ? '#fff' : 'rgba(255,255,255,0.5)';
          return (
            <button key={t.id} onClick={() => onChange(t.id)} className="relative flex flex-col items-center gap-1 py-3 text-xs">
              <t.icon color={color} size={22} />
              <span style={{ color }} className={isActive ? 'font-medium' : ''}>
                {t.label}
              </span>
              {t.id === 'activity' && ridesBadge > 0 && (
                <span className="absolute top-1.5 right-[calc(50%-20px)] min-w-[16px] h-4 px-1 rounded-full bg-transit-coral text-white text-[10px] leading-4 text-center">
                  {ridesBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ color, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5 12 4l8 7.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HistoryIcon({ color, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3.5" width="14" height="17" rx="1.5" stroke={color} strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
