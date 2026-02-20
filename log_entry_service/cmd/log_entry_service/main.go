package main

import (
	"log"
	"net/http"
	"time"

	"TimeTrackerV3/log_entry_service/config"
	"TimeTrackerV3/log_entry_service/db"
	"TimeTrackerV3/log_entry_service/internal/handler"
	"TimeTrackerV3/log_entry_service/internal/integration"
	"TimeTrackerV3/log_entry_service/internal/logger"
	"TimeTrackerV3/log_entry_service/internal/repository"
	"TimeTrackerV3/log_entry_service/internal/service"

	"github.com/gorilla/mux"
)

func main() {
	config := config.Load()
	dbConn := db.ConnectDB(config)
	repo := repository.NewRepository(dbConn)
	client := integration.NewEmployeesClient()
	svc := service.NewService(repo, client)
	h := handler.NewHandler(svc)
	r := mux.NewRouter()
	handler.RegisterRoutes(r, h)
	loggedMux := logger.Middleware(r)

	// Http Server
	addr := ":" + config.Port
	log.Println("The server is running at http://localhost:" + config.Port)
	server := &http.Server{
		Addr:         addr,
		Handler:      loggedMux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Fatal(server.ListenAndServe())
}
