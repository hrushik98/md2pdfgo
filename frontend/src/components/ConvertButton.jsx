import { DownloadIcon, SpinnerIcon } from './icons'

// ConvertButton triggers the backend PDF export. It shows a spinner and a
// "Preparing…" label while the request is in flight.
export default function ConvertButton({ onClick, loading }) {
  return (
    <button
      type="button"
      className="fl-download-btn"
      onClick={onClick}
      disabled={loading}
      title="Download as PDF"
    >
      {loading ? <SpinnerIcon /> : <DownloadIcon />}
      <span>{loading ? 'Preparing…' : 'Download PDF'}</span>
    </button>
  )
}
