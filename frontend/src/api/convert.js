// convertToPDF sends the markdown to the backend, receives the generated PDF as
// a blob, and triggers a browser download of document.pdf.
export async function convertToPDF(markdownText) {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ markdown: markdownText }),
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const data = await response.json()
      if (data && data.error) {
        message = data.error
      }
    } catch {
      // Response was not JSON; keep the default status message.
    }
    throw new Error(message)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = 'document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(url)
  }
}
