# md2pdf — Foliate

A full-stack **Markdown → PDF** converter with a warm, editorial interface
("Foliate"). Write Markdown, watch a live preview on a cream "paper" sheet, and
download a clean, print-ready PDF that matches what you see.

- **Backend:** Go — [goldmark](https://github.com/yuin/goldmark) renders
  Markdown to styled HTML (a custom warm syntax theme via
  [chroma](https://github.com/alecthomas/chroma)), and
  [wkhtmltopdf](https://wkhtmltopdf.org/) turns that HTML into a PDF.
- **Frontend:** React + Vite — a fully responsive, tabbed **Write / Preview**
  UI (`marked` + `DOMPurify` + `highlight.js`) with:
  - a formatting **toolbar** (headings, bold/italic/strike/code, lists, task
    lists, quote, code block, link, image, table, divider) plus ⌘B / ⌘I / ⌘K
  - **light / dark** theme toggle
  - a custom **document title** (becomes the PDF header and filename)
  - document **style presets** (GitHub / Editorial / Academic / Minimal)
  - **page size** options (A4 / Letter)
  - live **word / character count** and reading time
  - a responsive layout that adapts from desktop down to mobile

## Project structure

```
md2pdf/
├── backend/
│   ├── main.go              # HTTP server, routing, CORS
│   ├── go.mod / go.sum
│   ├── Dockerfile
│   ├── config/config.go     # env-based configuration
│   ├── handlers/convert.go  # POST /convert -> streams a PDF
│   └── services/
│       ├── markdown.go      # Markdown -> styled HTML (goldmark + chroma)
│       └── pdf.go           # HTML -> PDF (wkhtmltopdf)
├── frontend/
│   ├── index.html           # loads Newsreader + IBM Plex fonts
│   ├── vite.config.js       # /api proxy -> backend
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── main.jsx
│       ├── App.jsx          # Foliate shell: header, tabs, controls
│       ├── index.css        # theme variables + .md-doc styling
│       ├── api/convert.js
│       ├── lib/markdown.js  # marked + DOMPurify render
│       └── components/{Editor,Preview,ConvertButton,icons}.jsx
├── docker-compose.yml
└── README.md
```

## Prerequisites

- **Go 1.22+**
- **Node 18+**
- **wkhtmltopdf** installed and on your `PATH` (only needed to run the backend
  outside Docker)
  - macOS: download the installer from <https://wkhtmltopdf.org/downloads.html>
    (it is no longer in Homebrew)
  - Debian/Ubuntu: `sudo apt-get install -y wkhtmltopdf`

  Verify with `wkhtmltopdf --version`.

## Running locally

### Backend

```bash
cd backend
go run .
```

The API listens on <http://localhost:8080> with:

- `POST /convert` — JSON body, responds with `application/pdf` bytes (or a JSON
  `{ "error": "..." }` on failure):

  ```json
  {
    "markdown": "# Hello",           // required
    "title": "My Document",          // optional — becomes the PDF header + filename
    "preset": "github",              // optional — github | editorial | academic | minimal
    "pageSize": "a4"                 // optional — a4 | letter
  }
  ```

- `GET /health` — `{ "status": "ok" }`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The Vite dev server proxies `/api/*` to the
backend on port 8080, so both must be running.

#### Configuration (backend env vars)

| Variable           | Default                  | Description                       |
| ------------------ | ------------------------ | --------------------------------- |
| `PORT`             | `8080`                   | Port the server listens on        |
| `ALLOWED_ORIGIN`   | `http://localhost:5173`  | CORS `Access-Control-Allow-Origin`|
| `WKHTMLTOPDF_PATH` | `wkhtmltopdf`            | Path to the wkhtmltopdf binary    |

## Running with Docker

No local Go, Node, or wkhtmltopdf required — the backend image installs
wkhtmltopdf for you.

```bash
docker-compose up --build
```

- Frontend: <http://localhost:5173>
- Backend:  <http://localhost:8080>

## How it works

1. The browser renders a **live preview** locally (`marked` → `DOMPurify` →
   `highlight.js`) styled to match the final PDF.
2. On **Download PDF**, the editor's Markdown plus the chosen title, preset, and
   page size are sent to `POST /api/convert`, which Vite proxies to the
   backend's `/convert`.
3. `services.ConvertMarkdownToHTML` renders the Markdown to a full, styled HTML
   document (GFM, footnotes, a warm chroma syntax theme, the document header,
   and the selected preset).
4. `services.ConvertHTMLToPDF` writes the HTML to a temp file and shells out to
   `wkhtmltopdf` (with the selected page size) to produce the PDF.
5. The handler streams the PDF back with a `Content-Disposition` attachment
   header named after the document title, and the frontend triggers the
   download.

> **Note:** the preview and the PDF share the same `.md-doc` styling and warm
> syntax palette, so the downloaded PDF looks like what you see on screen.
