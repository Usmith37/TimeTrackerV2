package service

import (
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/integration"
	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/repository"
)

type Repository interface {
	GetAll() []repository.LogEntry
	GetByKeycloakId(keycloakId string) []repository.LogEntry
	GetStarted(keycloakId string) []repository.LogEntry
	Create(entry repository.LogEntry) (int64, error)
	Update(entry repository.LogEntry) error
}

type Service struct {
	repo            Repository
	employeesClient *integration.EmployeesClient
}

func NewService(repo *repository.Repository, client *integration.EmployeesClient) *Service {
	return &Service{
		repo:            repo,
		employeesClient: client,
	}
}

//func (s *Service) GetLogEntriesByEmployeeID(employeeID string) ([]repository.LogEntry, error) {
//	return s.repo.GetByEmployeeID(employeeID)
//}

//func (s *Service) EndLogEntry(req handler.EndRequest) error {
//	entries, err := s.repo.GetByEmployeeID(req.EmployeeId)
//	if err != nil {
//		return err
//	}
//
//	var entry *repository.LogEntry
//	for i := range entries {
//		if entries[i].EndTime == nil {
//			entry = &entries[i]
//			break
//		}
//	}
//
//	if entry == nil {
//		return errors.New("у Вас еще нет начатых смен")
//	}
//
//	now := time.Now()
//	entry.EndTime = &now
//	entry.Message = req.Message
//
//	entry.JobTime = int64(now.Sub(entry.StartTime).Seconds())
//
//	return s.repo.Update(*entry)
//}
