import { marked } from 'marked'
import DOMPurify from 'dompurify'

// GFM with hard line breaks, matching the goldmark configuration on the backend
// so the live preview lines up with the generated PDF.
marked.setOptions({ gfm: true, breaks: true })

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// renderMarkdown converts markdown to sanitized HTML and prepends a document
// header built from the title (mirroring the PDF output).
export function renderMarkdown(markdown, title) {
  let body = ''
  try {
    body = marked.parse(markdown || '')
  } catch {
    body = ''
  }
  body = DOMPurify.sanitize(body)

  const trimmedTitle = (title || '').trim()
  const header = trimmedTitle
    ? `<div class="doc-header"><h1>${escapeHtml(trimmedTitle)}</h1></div>`
    : ''

  return header + body
}

// countStats returns word count, character count, and an estimated reading time.
export function countStats(markdown) {
  const text = markdown || ''
  const words = (text.trim().match(/\S+/g) || []).length
  return {
    words,
    chars: text.length,
    readingTime: Math.max(1, Math.round(words / 200)),
  }
}
