package repository

func (r *Repository) Create(entry LogEntry) (int64, error) {
	query := `
		INSERT INTO log_entries (keycloak_id, start_time, end_time, employee_id, message, job_time)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`

	var id int64
	err := r.db.QueryRow(
		query,
		entry.KeycloakId,
		entry.StartTime,
		entry.EndTime,
		entry.EmployeeId,
		entry.Message,
		entry.JobTime,
	).Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}
