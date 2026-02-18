package handler

import (
	"net/http"
)

type LogEntryHandler interface {
	GetAll(w http.ResponseWriter, r *http.Request)
}

func RegisterRoutes(mux *http.ServeMux, logEntryHandler LogEntryHandler) {
	mux.HandleFunc("GET /api/log_entries", logEntryHandler.GetAll)
}
