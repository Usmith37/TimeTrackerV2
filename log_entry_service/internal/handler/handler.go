package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/repository"
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/service"
	"github.com/gorilla/mux"
)

type Service interface {
	GetAll() []repository.LogEntry
	GetByKeycloakId(keycloakId string) []repository.LogEntry
	StartLogEntry(keycloakId string) (int64, error)
	EndLogEntry(keycloakId, message string) error
}

type handler struct {
	service Service
}

func NewHandler(service Service) *handler {
	return &handler{service: service}
}

func (h *handler) GetAll(w http.ResponseWriter, r *http.Request) {
	logEntries := h.service.GetAll()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logEntries)
}

func (h *handler) GetByKeycloakId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	logEntries := h.service.GetByKeycloakId(id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logEntries)
}

func (h *handler) StartLogEntry(w http.ResponseWriter, r *http.Request) {
	var req StartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	id, err := h.service.StartLogEntry(req.KeycloakId)
	if err != nil {
		if err == service.ErrShiftAlreadyStarted {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := StartResponse{LogEntryId: id}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func (h *handler) EndLogEntry(w http.ResponseWriter, r *http.Request) {
	var req EndRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.service.EndLogEntry(req.KeycloakId, req.Message)
	if err != nil {
		switch err {
		case service.ErrNoStartedShift:
			http.Error(w, err.Error(), http.StatusConflict)
		default:
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
	resp := map[string]string{
		"message": "Shift ended successfully",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
