package service

import (
	"fmt"
	"time"

	"TimeTrackerV3/log_entry_service/internal/errors"
)

func (s *Service) EndLogEntry(keycloakId, message string) error {
	started := s.repo.GetStarted(keycloakId)
	if len(started) == 0 {
		return errors.ErrNoStartedShift
	}

	entry := started[0]
	now := timeWithoutZone(time.Now())
	entry.EndTime = &now
	entry.Message = &message
	fmt.Println("StartTime:", entry.StartTime)
	fmt.Println("EndTime:", *entry.EndTime)
	duration := entry.EndTime.Sub(entry.StartTime)
	entry.JobTime = int64(duration.Seconds())

	return s.repo.Update(entry)
}

func timeWithoutZone(t time.Time) time.Time {
	return time.Date(
		t.Year(), t.Month(), t.Day(),
		t.Hour(), t.Minute(), t.Second(), t.Nanosecond(),
		time.UTC,
	)
}
