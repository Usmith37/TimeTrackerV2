package model

import "time"

type LogEntry struct {
	ID         int64
	KeycloakID string
	StartTime  time.Time
	EndTime    *time.Time
	EmployeeID int64
	Message    string
	JobTime    int64
}
