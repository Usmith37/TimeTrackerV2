# Для запуска локального
migrate-all:
	$(MAKE) -C employee_service migrate
	$(MAKE) -C log_entry_service migrate

run-all-local:
	$(MAKE) -C employee_service run &
	$(MAKE) -C log_entry_service run &
	$(MAKE) -C mail_sender_service run &

build-all:
	$(MAKE) -C employee_service build GOOS=linux GOARCH=amd64
	$(MAKE) -C log_entry_service build GOOS=linux GOARCH=amd64
	$(MAKE) -C mail_sender_service build GOOS=linux GOARCH=amd64

## Для запуска в Docker
#run-all: build-all
#	docker-compose up --force-recreate --build
#
#run:
#	docker-compose up -d
#
#stop:
#	docker-compose down
#	docker rmi employee_service log_entry_service mail_sender_service
