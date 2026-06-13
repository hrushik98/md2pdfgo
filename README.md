# md2pdf

A full-stack **Markdown → PDF** converter. Write Markdown in a live editor,
preview it in real time, and download a clean, print-ready PDF with one click.

- **Backend:** Go — [goldmark](https://github.com/yuin/goldmark) renders
  Markdown to styled HTML, and [wkhtmltopdf](https://wkhtmltopdf.org/) turns that
  HTML into a PDF.
- **Frontend:** React + Vite — a split-pane editor/preview with
  `react-markdown` and syntax-highlighted code blocks.

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
│       ├── markdown.go      # Markdown -> styled HTML (goldmark)
│       └── pdf.go           # HTML -> PDF (wkhtmltopdf)
├── frontend/
│   ├── index.html
│   ├── vite.config.js       # /api proxy -> backend
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/convert.js
│       └── components/{Editor,Preview,ConvertButton}.jsx
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

- `POST /convert` — body `{ "markdown": "..." }`, responds with
  `application/pdf` bytes (or a JSON `{ "error": "..." }` on failure)
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

1. The browser sends the editor's Markdown to `POST /api/convert`, which Vite
   proxies to the backend's `/convert`.
2. `services.ConvertMarkdownToHTML` renders the Markdown to a full, styled HTML
   document (GFM, footnotes, syntax highlighting).
3. `services.ConvertHTMLToPDF` writes the HTML to a temp file and shells out to
   `wkhtmltopdf` to produce the PDF.
4. The handler streams the PDF back with a `Content-Disposition` attachment
   header, and the frontend triggers a download of `document.pdf`.
