function safeFilename(title) {
  const name = (title || 'document')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .slice(0, 80)
    .trim()
  return (name || 'document') + '.pdf'
}

// convertToPDF posts the document to the backend, receives the rendered PDF as a
// blob, and triggers a browser download named after the document title.
export async function convertToPDF({ markdown, title, preset, pageSize }) {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ markdown, title, preset, pageSize }),
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const data = await response.json()
      if (data && data.error) message = data.error
    } catch {
      // response was not JSON; keep the status message
    }
    throw new Error(message)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = safeFilename(title)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(url)
  }
}
