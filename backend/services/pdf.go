package services

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"

	"md2pdf/backend/config"
)

// pageSizeFlag maps an API page-size value to the wkhtmltopdf --page-size flag.
func pageSizeFlag(pageSize string) string {
	switch pageSize {
	case "letter", "Letter":
		return "Letter"
	default:
		return "A4"
	}
}

// ConvertHTMLToPDF renders a full HTML document to PDF bytes by shelling out to
// wkhtmltopdf. The HTML is written to a temporary file, wkhtmltopdf writes the
// result to a second temporary file, and both are cleaned up before returning.
func ConvertHTMLToPDF(htmlContent, pageSize string) ([]byte, error) {
	cfg := config.Load()

	// Temp file for the input HTML.
	inFile, err := os.CreateTemp("", "md2pdf-*.html")
	if err != nil {
		return nil, fmt.Errorf("create temp html file: %w", err)
	}
	defer os.Remove(inFile.Name())

	if _, err := inFile.WriteString(htmlContent); err != nil {
		inFile.Close()
		return nil, fmt.Errorf("write temp html file: %w", err)
	}
	if err := inFile.Close(); err != nil {
		return nil, fmt.Errorf("close temp html file: %w", err)
	}

	// Temp file path for the output PDF. We only need the path; wkhtmltopdf
	// writes the bytes, so close the handle immediately.
	outFile, err := os.CreateTemp("", "md2pdf-*.pdf")
	if err != nil {
		return nil, fmt.Errorf("create temp pdf file: %w", err)
	}
	outPath := outFile.Name()
	outFile.Close()
	defer os.Remove(outPath)

	cmd := exec.Command(
		cfg.WkhtmltopdfPath,
		"--page-size", pageSizeFlag(pageSize),
		"--margin-top", "15mm",
		"--margin-bottom", "15mm",
		"--margin-left", "15mm",
		"--margin-right", "15mm",
		"--encoding", "utf-8",
		"--enable-local-file-access",
		inFile.Name(),
		outPath,
	)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("wkhtmltopdf failed: %w: %s", err, stderr.String())
	}

	pdf, err := os.ReadFile(outPath)
	if err != nil {
		return nil, fmt.Errorf("read generated pdf: %w", err)
	}

	return pdf, nil
}
