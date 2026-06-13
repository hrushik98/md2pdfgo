# md2pdf

A full-stack **Markdown → PDF** converter. Write Markdown, watch a live preview and 
download a clean, print-ready PDF that matches what you see.


## Running with Docker

No local Go, Node, or wkhtmltopdf required — the backend image installs
wkhtmltopdf for you.

```bash
docker-compose up --build
```

- Frontend: <http://localhost:5173>
- Backend:  <http://localhost:8080>

