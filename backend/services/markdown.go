package services

import (
	"bytes"
	"fmt"
	stdhtml "html"

	"github.com/alecthomas/chroma/v2"
	"github.com/alecthomas/chroma/v2/styles"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

// md is the package-level goldmark instance. It is configured once in init()
// so that the parser and renderer are not rebuilt on every request.
var md goldmark.Markdown

// validPresets is the whitelist of document styles supported by the renderer.
var validPresets = map[string]bool{
	"github":    true,
	"editorial": true,
	"academic":  true,
	"minimal":   true,
}

func init() {
	// foliate is a warm, light syntax theme tuned to match the Foliate design
	// (terracotta keywords, green strings, blue numbers/builtins, purple
	// functions) on a cream code-block background.
	styles.Register(chroma.MustNewStyle("foliate", chroma.StyleEntries{
		chroma.Background:          "#2d2a26 bg:#fbf6ec",
		chroma.Comment:             "italic #9a8a6b",
		chroma.CommentPreproc:      "#b8512c",
		chroma.Keyword:             "#b8512c",
		chroma.KeywordType:         "#2f6f8f",
		chroma.OperatorWord:        "#b8512c",
		chroma.Name:                "#2d2a26",
		chroma.NameBuiltin:         "#2f6f8f",
		chroma.NameFunction:        "#8a5cb0",
		chroma.NameClass:           "#8a5cb0",
		chroma.NameTag:             "#2f6f8f",
		chroma.NameAttribute:       "#946b2d",
		chroma.NameDecorator:       "#946b2d",
		chroma.NameVariable:        "#946b2d",
		chroma.LiteralString:       "#4f7a3d",
		chroma.LiteralStringSymbol: "#b8512c",
		chroma.LiteralNumber:       "#2f6f8f",
		chroma.GenericStrong:       "bold",
		chroma.GenericEmph:         "italic",
	}))

	md = goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.Footnote,
			highlighting.NewHighlighting(
				highlighting.WithStyle("foliate"),
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

// documentTemplate wraps the rendered markdown in a complete, print-ready HTML
// document styled to match the Foliate "paper" preview. The single %s is
// replaced with the document body, so every literal percent sign in the
// embedded CSS is escaped as %%.
const documentTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>document</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { background: #fdfaf3; }

  .md-doc { color: #2d2a26; font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 16px; line-height: 1.72; word-wrap: break-word; max-width: 100%%; }
  .md-doc > *:first-child { margin-top: 0; }
  .md-doc > *:last-child { margin-bottom: 0; }
  .md-doc h1, .md-doc h2, .md-doc h3, .md-doc h4, .md-doc h5, .md-doc h6 { font-weight: 650; line-height: 1.3; margin: 1.55em 0 .6em; letter-spacing: -.01em; page-break-after: avoid; }
  .md-doc h1 { font-size: 1.95em; padding-bottom: .28em; border-bottom: 1px solid #e7dcc6; }
  .md-doc h2 { font-size: 1.5em; padding-bottom: .26em; border-bottom: 1px solid #efe6d4; }
  .md-doc h3 { font-size: 1.25em; }
  .md-doc h4 { font-size: 1.05em; }
  .md-doc h5, .md-doc h6 { font-size: .92em; color: #6f6453; }
  .md-doc p { margin: 0 0 1em; }
  .md-doc a { color: #b8512c; text-decoration: underline; text-underline-offset: 2px; text-decoration-thickness: 1px; }
  .md-doc strong { font-weight: 700; color: #221e19; }
  .md-doc em { font-style: italic; }
  .md-doc del { color: #9d8f78; }
  .md-doc ul, .md-doc ol { margin: 0 0 1em; padding-left: 1.55em; }
  .md-doc li { margin: .3em 0; }
  .md-doc li::marker { color: #b8512c; }
  .md-doc li > ul, .md-doc li > ol { margin: .3em 0; }
  .md-doc input[type="checkbox"] { margin-right: .5em; accent-color: #b8512c; }
  .md-doc blockquote { margin: 0 0 1em; padding: .4em 1.1em; border-left: 3px solid #d3a98f; color: #6f6453; background: #f8f1e6; border-radius: 0 6px 6px 0; page-break-inside: avoid; }
  .md-doc blockquote p:last-child { margin: 0; }
  .md-doc code { font-family: 'IBM Plex Mono', monospace; font-size: .86em; background: #efe6d4; color: #944521; padding: .15em .42em; border-radius: 5px; }
  .md-doc pre { background: #fbf6ec; border: 1px solid #e7dcc6; border-radius: 9px; padding: 15px 17px; overflow: auto; margin: 0 0 1.1em; page-break-inside: avoid; }
  .md-doc pre code { background: none; color: #2d2a26; padding: 0; font-size: .85em; line-height: 1.62; }
  .md-doc table { border-collapse: collapse; margin: 0 0 1.1em; width: 100%%; font-size: .94em; page-break-inside: avoid; }
  .md-doc th, .md-doc td { border: 1px solid #e4d8c1; padding: 9px 13px; text-align: left; }
  .md-doc th { background: #f1e8d7; font-weight: 650; }
  .md-doc tbody tr:nth-child(even) td { background: #faf6ec; }
  .md-doc img { max-width: 100%%; border-radius: 7px; }
  .md-doc hr { border: none; border-top: 1px solid #e4d8c1; margin: 1.7em 0; }
  .md-doc sup { font-size: .75em; }
  .md-doc .footnotes { margin-top: 2em; font-size: .9em; color: #6f6453; border-top: 1px solid #e4d8c1; padding-top: .6em; }
  .md-doc .doc-header { margin: 0 0 1.6em; padding-bottom: .7em; border-bottom: 2px solid #2c2620; }
  .md-doc .doc-header h1 { font-family: 'Newsreader', Georgia, serif; font-weight: 600; font-size: 2.3em; margin: 0; padding: 0; border: none; letter-spacing: -.015em; }

  /* ---- presets ---- */
  .md-doc[data-preset="editorial"] { font-family: 'Newsreader', Georgia, serif; font-size: 18.5px; line-height: 1.78; }
  .md-doc[data-preset="editorial"] h1, .md-doc[data-preset="editorial"] h2, .md-doc[data-preset="editorial"] h3, .md-doc[data-preset="editorial"] h4 { font-family: 'Newsreader', Georgia, serif; font-weight: 600; }
  .md-doc[data-preset="editorial"] h1 { border: none; }
  .md-doc[data-preset="editorial"] h2 { border-bottom: 1px solid #ece1cd; }
  .md-doc[data-preset="editorial"] .doc-header h1 { font-size: 2.6em; }

  .md-doc[data-preset="academic"] { font-family: 'Newsreader', Georgia, serif; font-size: 17px; line-height: 1.75; text-align: justify; hyphens: auto; }
  .md-doc[data-preset="academic"] h1, .md-doc[data-preset="academic"] h2, .md-doc[data-preset="academic"] h3 { font-family: 'Newsreader', Georgia, serif; text-align: left; border: none; }
  .md-doc[data-preset="academic"] .doc-header { text-align: center; border-bottom: 1px solid #2c2620; }
  .md-doc[data-preset="academic"] .doc-header h1 { font-size: 2em; }

  .md-doc[data-preset="minimal"] { line-height: 1.82; }
  .md-doc[data-preset="minimal"] h1, .md-doc[data-preset="minimal"] h2 { border: none; font-weight: 600; }
  .md-doc[data-preset="minimal"] h1 { font-size: 1.7em; margin-top: 1.2em; }
  .md-doc[data-preset="minimal"] .doc-header { border-bottom: 1px solid #e4d8c1; }
  .md-doc[data-preset="minimal"] .doc-header h1 { font-family: 'IBM Plex Sans', sans-serif; font-weight: 600; font-size: 1.9em; }
</style>
</head>
<body>
%s
</body>
</html>`

// ConvertMarkdownToHTML renders the given markdown source into a complete,
// styled HTML document that mirrors the live preview. The optional title
// becomes the document header, and preset selects one of the document styles
// (github, editorial, academic, minimal).
func ConvertMarkdownToHTML(markdownContent, title, preset string) (string, error) {
	if !validPresets[preset] {
		preset = "github"
	}

	var buf bytes.Buffer
	if err := md.Convert([]byte(markdownContent), &buf); err != nil {
		return "", fmt.Errorf("render markdown: %w", err)
	}

	header := ""
	if title != "" {
		header = `<div class="doc-header"><h1>` + stdhtml.EscapeString(title) + `</h1></div>`
	}

	content := fmt.Sprintf(`<div class="md-doc" data-preset="%s">%s%s</div>`, preset, header, buf.String())
	return fmt.Sprintf(documentTemplate, content), nil
}
