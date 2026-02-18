package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/model"
)

type Service interface {
	GetAll() []model.LogEntry
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
	if err := json.NewEncoder(w).Encode(logEntries); err != nil {
		log.Printf("Ошибка кодирования JSON: %v", err)
	}
}
