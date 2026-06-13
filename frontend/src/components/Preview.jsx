import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Scoped styles for the rendered markdown so headings, tables, and quotes look
// clean without pulling in a CSS framework.
const previewStyles = `
  .md-preview h1 { font-size: 1.8em; margin: 0.6em 0 0.4em; padding-bottom: 0.3em; border-bottom: 2px solid #e5e7eb; }
  .md-preview h2 { font-size: 1.4em; margin: 0.6em 0 0.4em; padding-bottom: 0.3em; border-bottom: 1px solid #e5e7eb; }
  .md-preview h3 { font-size: 1.2em; margin: 0.6em 0 0.4em; }
  .md-preview p { margin: 0 0 1em; }
  .md-preview a { color: #2563eb; }
  .md-preview ul, .md-preview ol { margin: 0 0 1em 1.5em; }
  .md-preview blockquote { margin: 1em 0; padding: 0 1em; border-left: 4px solid #d1d5db; color: #6b7280; }
  .md-preview table { width: 100%; border-collapse: collapse; margin: 1em 0; }
  .md-preview th, .md-preview td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
  .md-preview th { background: #f9fafb; }
  .md-preview :not(pre) > code { background: #f3f4f6; border-radius: 4px; padding: 0.2em 0.4em; font-family: monospace; font-size: 0.9em; }
  .md-preview img { max-width: 100%; }
`

export default function Preview({ markdown }) {
  return (
    <div
      className="md-preview"
      style={{
        height: '100%',
        overflowY: 'auto',
        background: '#ffffff',
        padding: '24px',
        fontFamily: 'sans-serif',
        lineHeight: 1.7,
        color: '#1a1a1a',
      }}
    >
      <style>{previewStyles}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const text = String(children).replace(/\n$/, '')
            const isBlock = match || text.includes('\n')
            return isBlock ? (
              <SyntaxHighlighter
                language={match ? match[1] : 'text'}
                style={oneDark}
                PreTag="div"
                customStyle={{ borderRadius: '8px', margin: '1em 0' }}
              >
                {text}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
