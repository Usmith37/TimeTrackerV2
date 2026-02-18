package main

import (
	"log"
	"net/http"
	"time"

	"github.com/Usmith37/TimeTrackerV2/log_entry_service/config"
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/db"
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/handler"
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/repository"
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/service"
	"github.com/Usmith37/TimeTrackerV2/logger"
)

func main() {
	dbConn := db.ConnectDB()
	repo := repository.NewLogEntryRepository(dbConn)
	svc := service.NewLogEntryService(repo)
	h := handler.NewHandler(svc)

	mux := http.NewServeMux()
	handler.RegisterRoutes(mux, h)

	loggedMux := logger.Middleware(mux)

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
