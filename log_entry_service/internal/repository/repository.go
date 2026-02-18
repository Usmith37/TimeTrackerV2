package repository

import (
	"database/sql"
	"time"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

// Получить все записи с end_time = NULL для конкретного keycloakId
func (r *Repository) FindByKeycloakIdAndEndTimeIsNull(keycloakId string) ([]LogEntry, error) {
	rows, err := r.db.Query(`
		SELECT id, start_time, end_time, keycloak_id, employee_id, message, job_time
		FROM log_entries
		WHERE keycloak_id = ? AND end_time IS NULL
	`, keycloakId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []LogEntry
	for rows.Next() {
		var e LogEntry
		if err := rows.Scan(&e.Id, &e.StartTime, &e.EndTime, &e.KeycloakId, &e.EmployeeId, &e.Message, &e.JobTime); err != nil {
			continue
		}
		entries = append(entries, e)
	}
	return entries, nil
}

// Получить все записи между start и end
func (r *Repository) FindByStartTimeBetween(start, end time.Time) ([]LogEntry, error) {
	rows, err := r.db.Query(`
		SELECT id, start_time, end_time, keycloak_id, employee_id, message, job_time
		FROM log_entries
		WHERE start_time BETWEEN ? AND ?
	`, start, end)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []LogEntry
	for rows.Next() {
		var e LogEntry
		if err := rows.Scan(&e.Id, &e.StartTime, &e.EndTime, &e.KeycloakId, &e.EmployeeId, &e.Message, &e.JobTime); err != nil {
			continue
		}
		entries = append(entries, e)
	}
	return entries, nil
}
