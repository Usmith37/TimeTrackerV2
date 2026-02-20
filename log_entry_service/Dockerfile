FROM golang:1.26 AS builder
LABEL stage=builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o ./bin/log_entry_service ./cmd/log_entry_service

FROM ubuntu:latest
COPY --from=builder /app/bin/log_entry_service /log_entry_service
CMD ["/log_entry_service"]
