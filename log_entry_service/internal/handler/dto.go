package handler

import "github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/repository"

type StartRequest struct {
	KeycloakId string `json:"keycloakId"`
}

type EndRequest struct {
	KeycloakId string `json:"keycloakId"`
	Message    string `json:"message"`
}

type StartResponse struct {
	LogEntryId int64 `json:"logEntryId"`
}

type EndResponse struct {
	Message string `json:"message"`
}

type GetLogEntriesByEmployeeIdResponse struct {
	LogEntryList []repository.LogEntry `json:"logEntryList"`
}
