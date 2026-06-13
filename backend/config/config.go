package config

import "os"

// Config holds runtime configuration sourced from environment variables.
type Config struct {
	Port            string
	AllowedOrigin   string
	WkhtmltopdfPath string
}

// Load reads configuration from the environment, applying sensible defaults
// for any value that is not set.
func Load() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		AllowedOrigin:   getEnv("ALLOWED_ORIGIN", "http://localhost:5173"),
		WkhtmltopdfPath: getEnv("WKHTMLTOPDF_PATH", "wkhtmltopdf"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
