package service

import (
	"time"

	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/repository"
)

func (s *Service) StartLogEntry(keycloakId string) (int64, error) {

	started := s.repo.GetStarted(keycloakId)

	if len(started) > 0 {
		return 0, ErrShiftAlreadyStarted
	}
	employeeDto, err := s.employeesClient.GetEmployeeById(keycloakId)
	if err != nil {
		return 0, err
	}

	entry := repository.LogEntry{
		StartTime:  time.Now(),
		KeycloakId: keycloakId,
		EmployeeId: employeeDto.StuffId,
		EndTime:    nil,
		Message:    nil,
		JobTime:    0,
	}

	return s.repo.Create(entry)
}
