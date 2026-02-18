package repository

import (
	"database/sql"

	"github.com/Usmith37/TimeTrackerV2/log_entry_service/internal/model"
)

type LogEntryRepository struct {
	db *sql.DB
}

func NewLogEntryRepository(db *sql.DB) *LogEntryRepository {
	return &LogEntryRepository{db: db}
}

func (r *LogEntryRepository) GetAll() []model.LogEntry {
	rows, err := r.db.Query("SELECT id, start_time, end_time, keycloak_id, employee_id, message, job_time FROM log_entries")
	if err != nil {
		return []model.LogEntry{}
	}
	defer rows.Close()

	var entries []model.LogEntry
	for rows.Next() {
		var e model.LogEntry
		if err := rows.Scan(&e.ID, &e.StartTime, &e.EndTime, &e.KeycloakID, &e.EmployeeID, &e.Message, &e.JobTime); err != nil {
			continue
		}
		entries = append(entries, e)
	}
	return entries
}
