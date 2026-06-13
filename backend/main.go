package main

import (
	"encoding/json"
	"log"
	"net/http"

	"md2pdf/backend/config"
	"md2pdf/backend/handlers"
)

func main() {
	cfg := config.Load()

	mux := http.NewServeMux()
	mux.HandleFunc("/convert", handlers.ConvertHandler)
	mux.HandleFunc("/health", healthHandler)

	addr := ":" + cfg.Port
	log.Printf("md2pdf backend listening on %s", addr)
	if err := http.ListenAndServe(addr, withCORS(cfg, mux)); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// withCORS wraps the given handler with permissive CORS headers scoped to the
// configured allowed origin and short-circuits OPTIONS preflight requests.
func withCORS(cfg *config.Config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", cfg.AllowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
