run:
	go run ./cmd/log_entry_service

test:
	go test -v -race -count 1 ./...

build:
	go build -o ./bin/log_entry_service ./cmd/log_entry_service

LOCAL_BIN := $(CURDIR)/bin

.bin-goose:
	powershell -Command "Set-Item Env:GOBIN '$(LOCAL_BIN)'; go install github.com/pressly/goose/v3/cmd/goose@latest"

migrate: .bin-goose
	powershell -Command "& '$(LOCAL_BIN)/goose.exe' -dir ./migrations postgres 'host=localhost port=5432 user=postgres1 password=postgres1 dbname=TestDBInContainer sslmode=disable' up"

migrate-status: .bin-goose
	powershell -Command "& '$(LOCAL_BIN)/goose.exe' -dir ./migrations postgres 'host=localhost port=5432 user=postgres1 password=postgres1 dbname=TestDBInContainer sslmode=disable' status"