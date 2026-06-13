package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"md2pdf/backend/services"
)

// ConvertRequest is the expected JSON body for the convert endpoint.
type ConvertRequest struct {
	Markdown string `json:"markdown"`
	Title    string `json:"title"`
	Preset   string `json:"preset"`
	PageSize string `json:"pageSize"`
}

var unsafeFilenameChars = regexp.MustCompile(`[\\/:*?"<>|]+`)

// ConvertHandler accepts a JSON payload containing markdown (plus an optional
// document title, style preset, and page size), renders it to a styled PDF, and
// streams the PDF bytes back to the client as a download.
func ConvertHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var req ConvertRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("convert: invalid request body: %v", err)
		writeError(w, http.StatusBadRequest, "invalid JSON request body")
		return
	}

	if strings.TrimSpace(req.Markdown) == "" {
		writeError(w, http.StatusBadRequest, "markdown field is required")
		return
	}

	htmlDoc, err := services.ConvertMarkdownToHTML(req.Markdown, strings.TrimSpace(req.Title), req.Preset)
	if err != nil {
		log.Printf("convert: markdown to html failed: %v", err)
		writeError(w, http.StatusInternalServerError, "failed to render markdown")
		return
	}

	pdf, err := services.ConvertHTMLToPDF(htmlDoc, req.PageSize)
	if err != nil {
		log.Printf("convert: html to pdf failed: %v", err)
		writeError(w, http.StatusInternalServerError, "failed to generate PDF")
		return
	}

	filename := safeFilename(req.Title)
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", `attachment; filename="`+filename+`"`)
	w.Header().Set("Content-Length", strconv.Itoa(len(pdf)))
	if _, err := w.Write(pdf); err != nil {
		log.Printf("convert: failed to write pdf response: %v", err)
	}
}

// safeFilename derives a download filename from the document title, falling back
// to "document.pdf" when the title is empty.
func safeFilename(title string) string {
	name := strings.TrimSpace(title)
	name = unsafeFilenameChars.ReplaceAllString(name, "-")
	if len(name) > 80 {
		name = name[:80]
	}
	name = strings.TrimSpace(name)
	if name == "" {
		name = "document"
	}
	return name + ".pdf"
}

func writeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
