import { useEffect, useMemo, useState } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import ConvertButton from './components/ConvertButton'
import { MoonIcon, SunIcon, WriteIcon, EyeIcon, FileIcon } from './components/icons'
import { renderMarkdown, countStats } from './lib/markdown'
import { convertToPDF } from './api/convert'

const PRESET_LABELS = {
  github: 'GitHub',
  editorial: 'Editorial',
  academic: 'Academic',
  minimal: 'Minimal',
}

const SAMPLE_MARKDOWN = [
  'A quick tour of everything **Foliate** can turn into a polished PDF. The title above becomes your document header — edit anything on the left, then switch to **Preview** or hit **Download PDF**.',
  '',
  '> "Write once in Markdown — export anywhere." Use the toolbar above, or paste your own document over this one.',
  '',
  '## Formatting basics',
  '',
  'You get **bold**, *italic*, ~~strikethrough~~, and `inline code` out of the box. Links like [the spec](https://commonmark.org) keep their accent color.',
  '',
  '### A few lists',
  '',
  '- Espresso, then write',
  '- Headings create structure',
  '- Export to A4 or Letter',
  '',
  '1. Paste your Markdown',
  '2. Pick a document style',
  '3. Download the PDF',
  '',
  '- [x] Live preview',
  '- [x] Syntax highlighting',
  '- [ ] Your next great doc',
  '',
  '## Code blocks',
  '',
  '```js',
  'function greet(name) {',
  '  // syntax highlighting included',
  '  const today = new Date();',
  '  return `Hello, ${name}!`;',
  '}',
  '',
  'console.log(greet("world"));',
  '```',
  '',
  '## Tables',
  '',
  '| Preset    | Body font   | Best for            |',
  '| --------- | ----------- | ------------------- |',
  '| GitHub    | Sans-serif  | READMEs & notes     |',
  '| Editorial | Serif       | Essays & articles   |',
  '| Academic  | Serif       | Papers & reports    |',
  '| Minimal   | Sans-serif  | Clean one-pagers    |',
  '',
  '---',
  '',
  'Happy writing. ✍',
].join('\n')

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('fl-theme') || 'light')
  const [tab, setTab] = useState('write')
  const [preset, setPreset] = useState('github')
  const [pageSize, setPageSize] = useState('a4')
  const [title, setTitle] = useState('The Markdown Field Guide')
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    localStorage.setItem('fl-theme', theme)
  }, [theme])

  const html = useMemo(() => renderMarkdown(markdown, title), [markdown, title])
  const stats = useMemo(() => countStats(markdown), [markdown])

  const handleConvert = async () => {
    if (exporting) return
    setExporting(true)
    try {
      await convertToPDF({ markdown, title, preset, pageSize })
    } catch (error) {
      alert('Conversion failed: ' + error.message)
    } finally {
      setExporting(false)
    }
  }

  const isDark = theme === 'dark'
  const pageLabel = pageSize === 'a4' ? 'A4' : 'Letter'

  return (
    <div className="fl-app" data-theme={theme}>
      <header className="fl-header">
        <div className="fl-brand">
          <div className="fl-logo">F</div>
          <div className="fl-brand-text">
            <span className="fl-brand-name">Foliate</span>
            <span className="fl-brand-sub">Markdown → PDF</span>
          </div>
        </div>

        <div className="fl-titlebox">
          <FileIcon />
          <input
            className="fl-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled document"
            spellCheck={false}
          />
        </div>

        <div className="fl-actions">
          <button
            type="button"
            className="fl-icon-btn"
            title="Toggle theme"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <ConvertButton onClick={handleConvert} loading={exporting} />
        </div>
      </header>

      <div className="fl-controls">
        <div className="fl-tabs">
          <button
            type="button"
            className={'fl-tab' + (tab === 'write' ? ' is-active' : '')}
            onClick={() => setTab('write')}
          >
            <WriteIcon />
            <span>Write</span>
          </button>
          <button
            type="button"
            className={'fl-tab' + (tab === 'preview' ? ' is-active' : '')}
            onClick={() => setTab('preview')}
          >
            <EyeIcon />
            <span>Preview</span>
          </button>
        </div>

        <div className="fl-control-group">
          <label className="fl-field">
            Style
            <select className="fl-select" value={preset} onChange={(e) => setPreset(e.target.value)}>
              <option value="github">GitHub</option>
              <option value="editorial">Editorial</option>
              <option value="academic">Academic</option>
              <option value="minimal">Minimal</option>
            </select>
          </label>
          <label className="fl-field">
            Page
            <select className="fl-select" value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </label>
        </div>
      </div>

      <div className="fl-body">
        {tab === 'write' ? (
          <Editor
            value={markdown}
            onChange={setMarkdown}
            stats={stats}
            presetLabel={PRESET_LABELS[preset]}
            pageLabel={pageLabel}
          />
        ) : (
          <Preview html={html} preset={preset} pageSize={pageSize} />
        )}
      </div>
    </div>
  )
}

export default App
