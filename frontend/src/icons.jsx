// Shared line-icon set. Every icon takes `color` (defaults to currentColor)
// and `size` so call sites can restyle without a new component per state.
const base = (size) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none' });

export function CarLogo({ className = '', color = '#fff' }) {
  return (
    <svg className={className} width="54" height="30" viewBox="0 0 64 34" fill="none">
      <path
        d="M4 23c0-2 1.5-3.8 3.4-4.4L11 13.6c1-1.5 2.7-2.4 4.5-2.4h16c1.9 0 3.7.9 4.8 2.5l3.3 4.7 5.8 1.3c1.9.4 3.2 2.1 3.2 4v3c0 1.4-1.1 2.5-2.5 2.5h-2.6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 23v-1.5C4 20.1 5.1 19 6.5 19h36c1.4 0 2.5 1.1 2.5 2.5V23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M11 19V13.6M30 19l-3.3-5.8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="26" r="3.2" fill="#000" stroke={color} strokeWidth="2" />
      <circle cx="37" cy="26" r="3.2" fill="#000" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export const BackArrow = ({ size = 22, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M19 12H5M11 6l-6 6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseX = ({ size = 20, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChevronRight = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="m9 6 6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CarGlyph = ({ size = 22, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M4 16v-2.5a2 2 0 0 1 1.4-1.9l1.2-3.4A2 2 0 0 1 8.5 6.8h7a2 2 0 0 1 1.9 1.4l1.2 3.4a2 2 0 0 1 1.4 1.9V16" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 16h16v1.6a1 1 0 0 1-1 1h-1.3a1 1 0 0 1-1-1V16M6.3 17.6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V16" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="7.5" cy="16" r="1.4" fill={color} />
    <circle cx="16.5" cy="16" r="1.4" fill={color} />
  </svg>
);

export const SearchGlyph = ({ size = 22, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <circle cx="10.5" cy="10.5" r="6" stroke={color} strokeWidth="1.8" />
    <path d="m19 19-4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const PinGreen = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 21s6.5-5.8 6.5-11A6.5 6.5 0 1 0 5.5 10c0 5.2 6.5 11 6.5 11Z" fill="#1F8A5F" />
    <circle cx="12" cy="10" r="2.3" fill="#fff" />
  </svg>
);

export const FlagRed = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M6 21V4" stroke="#D64933" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 4h11l-2.5 3L17 10H6" fill="#D64933" stroke="#D64933" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const MapGlyph = ({ size = 20, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 4v14M15 6v14" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const SwapGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M8 6v12M8 6 5 9M8 6l3 3M16 18V6M16 18l3-3m-3 3-3-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CalendarGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="M4 10h16M8 3.5v3M16 3.5v3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const ClockGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.6" />
    <path d="M12 8v4.3l3 1.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BikeGlyph = ({ size = 22, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <circle cx="6" cy="17" r="3" stroke={color} strokeWidth="1.7" />
    <circle cx="18" cy="17" r="3" stroke={color} strokeWidth="1.7" />
    <path d="M6 17l4-8h4l3 5h-9l3.5-5M10 9h3" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 17h4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const SuvGlyph = ({ size = 22, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M3.5 16v-3.2a2 2 0 0 1 1-1.7l1.6-5A2 2 0 0 1 8 4.7h8a2 2 0 0 1 1.9 1.4l1.6 5a2 2 0 0 1 1 1.7V16" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M3.5 16h17v1.3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16M6.5 17.3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M5.5 11h13" stroke={color} strokeWidth="1.7" />
    <circle cx="7.5" cy="16" r="1.3" fill={color} />
    <circle cx="16.5" cy="16" r="1.3" fill={color} />
  </svg>
);

export const ShieldGlyph = ({ size = 26 }) => (
  <svg {...base(size)}>
    <path d="M12 3.5 5 6v5.5c0 4.6 3 7.8 7 9 4-1.2 7-4.4 7-9V6l-7-2.5Z" fill="#2F7DD9" />
    <path d="M12 3.5v16c4-1.2 7-4.4 7-9V6l-7-2.5Z" fill="#1F6BC2" />
  </svg>
);

export const PencilGlyph = ({ size = 16, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const MoonGlyph = ({ size = 22, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const CheckBadge = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m12 2 2.2 1.3 2.5-.4 1.3 2.2 2.2 1.3-.4 2.5L21 11l-1.3 2.2.4 2.5-2.2 1.3-1.3 2.2-2.5-.4L12 20l-2.2-1.3-2.5.4-1.3-2.2-2.2-1.3.4-2.5L3 11l1.3-2.2-.4-2.5 2.2-1.3 1.3-2.2 2.5.4L12 2Z" fill="#1F8A5F" />
    <path d="m8.5 12 2.3 2.3 4.7-4.7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LogoutGlyph = ({ size = 18, color = '#D64933' }) => (
  <svg {...base(size)}>
    <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChatGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M4 5.5h16v10H9.5L5 19v-3.5H4v-10Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export const LocateGlyph = ({ size = 20, color = '#14171C' }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="2.6" fill={color} />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const CompassGlyph = ({ size = 20, color = '#14171C' }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
    <path d="m14.5 9.5-1.2 4-4 1.2 1.2-4 4-1.2Z" fill={color} />
  </svg>
);

export const PeopleGlyph = ({ size = 16, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <circle cx="8.5" cy="8" r="2.6" stroke={color} strokeWidth="1.6" />
    <path d="M3.5 18c.7-3 2.6-4.5 5-4.5s4.3 1.5 5 4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="16.5" cy="9" r="2.1" stroke={color} strokeWidth="1.4" />
    <path d="M15.3 13.6c1.8.3 3 1.6 3.5 3.6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SeatGlyph = ({ size = 15, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M7 4v7a2 2 0 0 0 2 2h4M7 4H5.5M7 4h1.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 13v4a2 2 0 0 0 2 2h2.5M13 13h-1M13 13h2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="17.5" cy="18.8" r="1" fill={color} />
  </svg>
);

export const DistanceGlyph = ({ size = 15, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M7 4v16M17 4v16" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2.5 2.5" />
    <path d="m4 7 3-3 3 3M21 17l-3 3-3-3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CircleCheck = ({ size = 16 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" stroke="#1F8A5F" strokeWidth="1.8" />
    <path d="m8 12.3 2.6 2.6L16.3 9" stroke="#1F8A5F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FilterGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M4 7h16M7 12h10M10 17h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const GridGlyph = ({ size = 16, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" fill={color} />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" fill={color} />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" fill={color} />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" fill={color} />
  </svg>
);

export const PersonGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="8" r="3.4" stroke={color} strokeWidth="1.7" />
    <path d="M4.5 19.5c1-4 3.7-6 7.5-6s6.5 2 7.5 6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const CakeGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <path d="M4 20v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M4 20h16M4 16.5c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0 2-1 3 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 8V5.5M9.5 12V9M14.5 12V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 5.5c-1 0-1-1.5 0-2.5 1 1 1 2.5 0 2.5Z" fill={color} />
  </svg>
);

export const MailGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="m4.5 7 7.5 6 7.5-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LockGlyph = ({ size = 18, color = 'currentColor' }) => (
  <svg {...base(size)}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke={color} strokeWidth="1.6" />
  </svg>
);
