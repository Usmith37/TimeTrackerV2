package repository

import "time"

type LogEntry struct {
	Id         int64
	KeycloakId string
	StartTime  time.Time
	EndTime    *time.Time
	EmployeeId int64
	Message    *string
	JobTime    int64
}
