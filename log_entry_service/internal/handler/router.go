package handler

import (
	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router, h *handler) {
	r.HandleFunc("/api/log_entries", h.GetAll).Methods("GET")
	r.HandleFunc("/api/log_entries/{id}", h.GetByKeycloakId).Methods("GET")
	r.HandleFunc("/api/log_entries/start", h.StartLogEntry).Methods("POST")
	r.HandleFunc("/api/log_entries/end", h.EndLogEntry).Methods("PUT")
}
