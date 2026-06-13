import { useState } from 'react'

// ConvertButton triggers the PDF conversion. It shows a loading label and is
// disabled while a conversion is in flight.
export default function ConvertButton({ onClick, loading }) {
  const [hovered, setHovered] = useState(false)

  const background = loading ? '#1e3a8a' : hovered ? '#1d4ed8' : '#2563eb'

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background,
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '15px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s ease',
      }}
    >
      {loading ? 'Converting...' : 'Convert to PDF'}
    </button>
  )
}
