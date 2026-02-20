package service

import "TimeTrackerV3/log_entry_service/internal/repository"

func (s *Service) GetAll() []repository.LogEntry {
	return s.repo.GetAll()
}
