package main

import (
	"log"
	"net/http"
	"time"

	"github.com/Usmith37/TimeTrackerV3/log_entry_service/config"
	"github.com/Usmith37/TimeTrackerV3/log_entry_service/db"
	"github.com/Usmith37/TimeTrackerV3/log_entry_service/internal/handler"
	"github.com/Usmith37/TimeTrackerV3/log_entry_service/internal/integration"
	"github.com/Usmith37/TimeTrackerV3/log_entry_service/internal/repository"
	"github.com/Usmith37/TimeTrackerV3/log_entry_service/internal/service"
	"github.com/Usmith37/TimeTrackerV3/logger"
	"github.com/gorilla/mux"
)

func main() {
	dbConn := db.ConnectDB()
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
