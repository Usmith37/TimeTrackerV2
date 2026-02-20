package repository

import "time"

type LogEntry struct {
	Id         int64      `json:"id"`
	KeycloakId string     `json:"keycloakId"`
	StartTime  time.Time  `json:"startTime"`
	EndTime    *time.Time `json:"endTime"`
	EmployeeId int64      `json:"employeeId"`
	Message    *string    `json:"message"`
	JobTime    int64      `json:"jobTime"`
}
