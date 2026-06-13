import { useLayoutEffect, useRef } from 'react'
import {
  BoldIcon, ItalicIcon, StrikeIcon, InlineCodeIcon, QuoteIcon,
  BulletListIcon, NumberListIcon, TaskListIcon, CodeBlockIcon,
  LinkIcon, ImageIcon, TableIcon, DividerIcon,
} from './icons'

// Toolbar layout — arrays separated by dividers.
const TOOLBAR_GROUPS = [
  [
    { cmd: 'h1', title: 'Heading 1', label: 'H1' },
    { cmd: 'h2', title: 'Heading 2', label: 'H2' },
    { cmd: 'h3', title: 'Heading 3', label: 'H3' },
  ],
  [
    { cmd: 'bold', title: 'Bold  (⌘B)', icon: BoldIcon },
    { cmd: 'italic', title: 'Italic  (⌘I)', icon: ItalicIcon },
    { cmd: 'strike', title: 'Strikethrough', icon: StrikeIcon },
    { cmd: 'code', title: 'Inline code', icon: InlineCodeIcon },
  ],
  [
    { cmd: 'quote', title: 'Blockquote', icon: QuoteIcon },
    { cmd: 'ul', title: 'Bullet list', icon: BulletListIcon },
    { cmd: 'ol', title: 'Numbered list', icon: NumberListIcon },
    { cmd: 'task', title: 'Task list', icon: TaskListIcon },
    { cmd: 'codeblock', title: 'Code block', icon: CodeBlockIcon },
  ],
  [
    { cmd: 'link', title: 'Link  (⌘K)', icon: LinkIcon },
    { cmd: 'image', title: 'Image', icon: ImageIcon },
    { cmd: 'table', title: 'Table', icon: TableIcon },
    { cmd: 'hr', title: 'Divider', icon: DividerIcon },
  ],
]

export default function Editor({ value, onChange, stats, presetLabel, pageLabel }) {
  const ref = useRef(null)
  const pendingSelection = useRef(null)

  // After a programmatic edit, restore the caret/selection once React has
  // committed the new value to the textarea.
  useLayoutEffect(() => {
    if (pendingSelection.current && ref.current) {
      const [start, end] = pendingSelection.current
      ref.current.focus()
      ref.current.setSelectionRange(start, end)
      pendingSelection.current = null
    }
  })

  const commit = (next, selStart, selEnd) => {
    pendingSelection.current = [selStart, selEnd]
    onChange(next)
  }

  const apply = (cmd) => {
    const ta = ref.current
    if (!ta) return
    const v = ta.value
    const s = ta.selectionStart
    const e = ta.selectionEnd
    const sel = v.slice(s, e)

    const wrap = (before, after, placeholder) => {
      const inner = sel || placeholder
      commit(
        v.slice(0, s) + before + inner + after + v.slice(e),
        s + before.length,
        s + before.length + inner.length,
      )
    }

    const line = (prefix, ordered) => {
      const ls = v.lastIndexOf('\n', s - 1) + 1
      let le = v.indexOf('\n', e)
      if (le < 0) le = v.length
      const lines = v.slice(ls, le).split('\n')
      const re = /^\d+\.\s/
      const off = ordered
        ? lines.every((l) => re.test(l))
        : lines.every((l) => l.startsWith(prefix))
      const out = lines
        .map((l, i) =>
          off
            ? ordered
              ? l.replace(re, '')
              : l.slice(prefix.length)
            : ordered
              ? `${i + 1}. ${l}`
              : prefix + l,
        )
        .join('\n')
      commit(v.slice(0, ls) + out + v.slice(le), ls, ls + out.length)
    }

    const insert = (text, a, b) => commit(v.slice(0, s) + text + v.slice(e), a, b)

    switch (cmd) {
      case 'bold': return wrap('**', '**', 'bold text')
      case 'italic': return wrap('*', '*', 'italic text')
      case 'strike': return wrap('~~', '~~', 'strikethrough')
      case 'code': return wrap('`', '`', 'code')
      case 'h1': return line('# ')
      case 'h2': return line('## ')
      case 'h3': return line('### ')
      case 'quote': return line('> ')
      case 'ul': return line('- ')
      case 'ol': return line('', true)
      case 'task': return line('- [ ] ')
      case 'codeblock': {
        const inner = sel || 'code'
        const t = '\n```\n' + inner + '\n```\n'
        return insert(t, s + 5, s + 5 + inner.length)
      }
      case 'link': {
        const t = sel || 'link text'
        return insert('[' + t + '](https://)', s + 1, s + 1 + t.length)
      }
      case 'image': {
        const t = sel || 'alt text'
        return insert('![' + t + '](https://)', s + 2, s + 2 + t.length)
      }
      case 'table': {
        const t = '\n| Column A | Column B | Column C |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n| Cell | Cell | Cell |\n'
        return insert(t, s + t.length, s + t.length)
      }
      case 'hr': {
        const t = '\n\n---\n\n'
        return insert(t, s + t.length, s + t.length)
      }
      default:
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.target
      const s = ta.selectionStart
      const en = ta.selectionEnd
      commit(ta.value.slice(0, s) + '  ' + ta.value.slice(en), s + 2, s + 2)
      return
    }
    if (e.metaKey || e.ctrlKey) {
      const k = e.key.toLowerCase()
      if (k === 'b') { e.preventDefault(); apply('bold') }
      else if (k === 'i') { e.preventDefault(); apply('italic') }
      else if (k === 'k') { e.preventDefault(); apply('link') }
    }
  }

  return (
    <section className="fl-write">
      <div className="fl-toolbar">
        {TOOLBAR_GROUPS.map((group, gi) => (
          <span key={gi} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            {gi > 0 && <span className="fl-sep" />}
            {group.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.cmd}
                  type="button"
                  className="fl-tool-btn"
                  title={item.title}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => apply(item.cmd)}
                >
                  {Icon ? <Icon /> : item.label}
                </button>
              )
            })}
          </span>
        ))}
      </div>

      <textarea
        ref={ref}
        className="fl-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="# Start writing in Markdown…"
        spellCheck={false}
      />

      <div className="fl-statusbar">
        <span><strong>{stats.words.toLocaleString()}</strong> words</span>
        <span><strong>{stats.chars.toLocaleString()}</strong> chars</span>
        <span><strong>{stats.readingTime}</strong> min read</span>
        <span className="fl-status-meta">{presetLabel} · {pageLabel}</span>
      </div>
    </section>
  )
}
