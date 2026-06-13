import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/common'

// Preview renders the sanitized markdown HTML on a "paper" sheet and applies
// syntax highlighting to code blocks after each update.
export default function Preview({ html, preset, pageSize }) {
  const docRef = useRef(null)

  useEffect(() => {
    if (!docRef.current) return
    docRef.current.querySelectorAll('pre code').forEach((block) => {
      if (block.dataset.highlighted) return
      try {
        hljs.highlightElement(block)
      } catch {
        // ignore highlight failures for unknown languages
      }
    })
  }, [html, preset])

  return (
    <section className="fl-preview">
      <div className="fl-sheet" data-page={pageSize}>
        <div
          ref={docRef}
          className="md-doc"
          data-preset={preset}
          dangerouslySetInnerHTML={{
            __html: html || '<p class="fl-empty">Your preview will appear here as you write…</p>',
          }}
        />
      </div>
    </section>
  )
}
