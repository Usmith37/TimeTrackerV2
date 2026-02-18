package repository

func (r *Repository) Update(entry LogEntry) error {
	query := `
		UPDATE log_entries
		SET end_time = $1,
		    message = $2,
		    job_time = $3
		WHERE id = $4
	`
	_, err := r.db.Exec(query, entry.EndTime, entry.Message, entry.JobTime, entry.Id)
	return err
}
