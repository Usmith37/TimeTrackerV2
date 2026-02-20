package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	errs "github.com/Usmith37/TimeTrackerV3/log_entry_service/internal/errors"
	"github.com/Usmith37/TimeTrackerV3/log_entry_service/internal/repository"
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
	response := GetLogEntriesByEmployeeIdResponse{
		LogEntryList: logEntries,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *handler) StartLogEntry(w http.ResponseWriter, r *http.Request) {
	var req StartRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	id, err := h.service.StartLogEntry(req.KeycloakId)
	if err != nil {
		handleError(w, err)
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

	if err := h.service.EndLogEntry(req.KeycloakId, req.Message); err != nil {
		handleError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Смена успешно завершена",
	})
}

func handleError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")

	var status int
	switch {
	case errors.Is(err, errs.ErrShiftAlreadyStarted):
		status = http.StatusConflict
	case errors.Is(err, errs.ErrNoStartedShift):
		status = http.StatusConflict
	default:
		status = http.StatusInternalServerError
	}

	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{
		"message": err.Error(),
	})
}
