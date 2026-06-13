// Editor is a purely controlled dark-themed textarea for the raw markdown.
export default function Editor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      style={{
        width: '100%',
        height: '100%',
        fontFamily: 'monospace',
        fontSize: '14px',
        border: 'none',
        outline: 'none',
        resize: 'none',
        padding: '24px',
        background: '#1e1e2e',
        color: '#cdd6f4',
      }}
    />
  )
}
