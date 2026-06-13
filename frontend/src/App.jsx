import { useState } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import ConvertButton from './components/ConvertButton'
import { convertToPDF } from './api/convert'

const SAMPLE_MARKDOWN = `# md2pdf

A tiny Markdown to PDF converter. Edit the text on the left, watch the live
preview on the right, then click **Convert to PDF** to download.

## Features

- Live preview with GitHub-flavored Markdown
- Syntax-highlighted code blocks
- Tables, blockquotes, and footnotes

## Code

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("hello, md2pdf")
}
\`\`\`

## Table

| Language | Use case        | Fun? |
| -------- | --------------- | ---- |
| Go       | Backend / API   | yes  |
| React    | Frontend / UI   | yes  |

## Quote

> "Simplicity is the soul of efficiency."

Inline \`code\` and a [link](https://example.com) work too.
`

function App() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN)
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    setLoading(true)
    try {
      await convertToPDF(markdown)
    } catch (error) {
      alert('Conversion failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header
        style={{
          background: '#0f0f17',
          color: 'white',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.5px' }}>
          md2pdf
        </h1>
        <ConvertButton onClick={handleConvert} loading={loading} />
      </header>

      <main style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          <Editor value={markdown} onChange={setMarkdown} />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            borderLeft: '1px solid #e5e7eb',
          }}
        >
          <Preview markdown={markdown} />
        </div>
      </main>
    </div>
  )
}

export default App
