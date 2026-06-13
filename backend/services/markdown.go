package services

import (
	"bytes"
	"fmt"

	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

// md is the package-level goldmark instance. It is configured once in init()
// so that the parser and renderer are not rebuilt on every request.
var md goldmark.Markdown

func init() {
	md = goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.Footnote,
			highlighting.NewHighlighting(
				highlighting.WithStyle("github"),
			),
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithXHTML(),
		),
	)
}

// documentTemplate wraps the rendered markdown body in a full, print-friendly
// HTML document. The single %s is replaced with the rendered body, so every
// literal percent sign in the embedded CSS is escaped as %%.
const documentTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>document</title>
<style>
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  body {
    max-width: 860px;
    margin: 40px auto;
    padding: 0 40px;
    line-height: 1.7;
    color: #1a1a1a;
  }
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.25;
    margin-top: 1.5em;
  }
  h1 {
    padding-bottom: 0.3em;
    border-bottom: 2px solid #e5e7eb;
  }
  h2 {
    padding-bottom: 0.3em;
    border-bottom: 1px solid #e5e7eb;
  }
  p {
    margin: 0 0 1em;
  }
  a {
    color: #2563eb;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  code {
    background: #f3f4f6;
    border-radius: 4px;
    padding: 0.2em 0.4em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
  }
  pre {
    background: #f3f4f6;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
  }
  pre code {
    background: transparent;
    padding: 0;
    font-size: 0.9em;
  }
  blockquote {
    margin: 1em 0;
    padding: 0 1em;
    border-left: 4px solid #d1d5db;
    color: #6b7280;
  }
  table {
    width: 100%%;
    border-collapse: collapse;
    margin: 1em 0;
  }
  th, td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
  }
  th {
    background: #f9fafb;
  }
  img {
    max-width: 100%%;
  }
  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2em 0;
  }
  @media print {
    body {
      margin: 0;
      padding: 20px;
    }
  }
</style>
</head>
<body>
%s
</body>
</html>`

// ConvertMarkdownToHTML renders the given markdown source to a complete,
// styled HTML document ready to be handed to a PDF renderer.
func ConvertMarkdownToHTML(markdownContent string) (string, error) {
	var buf bytes.Buffer
	if err := md.Convert([]byte(markdownContent), &buf); err != nil {
		return "", fmt.Errorf("render markdown: %w", err)
	}
	return fmt.Sprintf(documentTemplate, buf.String()), nil
}
