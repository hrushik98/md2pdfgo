// Inline SVG icons ported from the Foliate design. Each inherits `currentColor`.
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" strokeWidth="1.8" {...stroke}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

export const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" strokeWidth="1.8" {...stroke}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.9" {...stroke}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
)

export const SpinnerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    strokeWidth="2.2"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    style={{ animation: 'fl-spin 0.7s linear infinite' }}
  >
    <path d="M21 12a9 9 0 1 1-6.2-8.6" opacity="0.9" />
  </svg>
)

export const WriteIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" strokeWidth="1.8" {...stroke}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
)

export const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" strokeWidth="1.8" {...stroke}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.7" {...stroke}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
)

export const BoldIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="2" {...stroke}>
    <path d="M6 4h7a4 4 0 0 1 0 8H6z" />
    <path d="M6 12h8a4 4 0 0 1 0 8H6z" />
  </svg>
)

export const ItalicIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.9" {...stroke}>
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
)

export const StrikeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.9" {...stroke}>
    <path d="M16 5H9.5a3 3 0 0 0-2.5 4.5" />
    <path d="M14.5 13A3 3 0 0 1 14 19H7" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
)

export const InlineCodeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.9" {...stroke}>
    <polyline points="8 7 3 12 8 17" />
    <polyline points="16 7 21 12 16 17" />
  </svg>
)

export const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.8" {...stroke}>
    <path d="M4 8h6v6c0 2.5-1.8 4-4.5 4.3" />
    <path d="M14 8h6v6c0 2.5-1.8 4-4.5 4.3" />
  </svg>
)

export const BulletListIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.8" {...stroke}>
    <line x1="9" y1="6" x2="20" y2="6" />
    <line x1="9" y1="12" x2="20" y2="12" />
    <line x1="9" y1="18" x2="20" y2="18" />
    <circle cx="4.2" cy="6" r="1.2" />
    <circle cx="4.2" cy="12" r="1.2" />
    <circle cx="4.2" cy="18" r="1.2" />
  </svg>
)

export const NumberListIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.8" {...stroke}>
    <line x1="10" y1="6" x2="20" y2="6" />
    <line x1="10" y1="12" x2="20" y2="12" />
    <line x1="10" y1="18" x2="20" y2="18" />
    <path d="M4 5l1.4-.7V9" />
    <path d="M3.6 9h2" />
    <path d="M3.6 15.2c0-.7.6-1.2 1.3-1.2s1.3.5 1.3 1.1c0 1.3-2.6 1.6-2.6 3.1h2.6" />
  </svg>
)

export const TaskListIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.8" {...stroke}>
    <rect x="3" y="4" width="5" height="5" rx="1.2" />
    <polyline points="3.6 6.4 4.7 7.5 7.2 4.8" />
    <line x1="11" y1="6.5" x2="20" y2="6.5" />
    <rect x="3" y="15" width="5" height="5" rx="1.2" />
    <line x1="11" y1="17.5" x2="20" y2="17.5" />
  </svg>
)

export const CodeBlockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.7" {...stroke}>
    <rect x="3" y="4" width="18" height="16" rx="2.2" />
    <polyline points="9.5 9 7.5 12 9.5 15" />
    <polyline points="14.5 9 16.5 12 14.5 15" />
  </svg>
)

export const LinkIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.8" {...stroke}>
    <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1 1" />
    <path d="M14 11a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1-1" />
  </svg>
)

export const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.7" {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="2.2" />
    <circle cx="8.5" cy="10" r="1.6" />
    <path d="M21 16l-5-5L5 19" />
  </svg>
)

export const TableIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.7" {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="9.5" y1="5" x2="9.5" y2="19" />
    <line x1="15.5" y1="5" x2="15.5" y2="19" />
  </svg>
)

export const DividerIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="1.9" {...stroke}>
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
)
