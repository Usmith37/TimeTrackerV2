package service

import "TimeTrackerV3/log_entry_service/internal/repository"

func (s *Service) GetByKeycloakId(keycloakId string) []repository.LogEntry {
	return s.repo.GetByKeycloakId(keycloakId)
}
