# ---- Stage 1: build the Go binary ----
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o md2pdf .

# ---- Stage 2: minimal runtime with wkhtmltopdf ----
FROM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends wkhtmltopdf ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/md2pdf .

EXPOSE 8080

CMD ["./md2pdf"]
