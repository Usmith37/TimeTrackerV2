package repository

func (r *Repository) GetAll() []LogEntry {
	query := `
		SELECT id, start_time, end_time, keycloak_id, employee_id, message, job_time
		FROM log_entries
	`
	rows, err := r.db.Query(query)
	if err != nil {
		return []LogEntry{}
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
	return entries
}
