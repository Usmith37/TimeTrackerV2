package service

import (
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/model"
)

type Repository interface {
	GetAll() []model.LogEntry
}

type Service struct {
	repo Repository
}

func NewLogEntryService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll() []model.LogEntry {
	return s.repo.GetAll()
}
