-- +goose Up
CREATE TABLE IF NOT EXISTS log_entries (
    id BIGSERIAL PRIMARY KEY,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    keycloak_id VARCHAR(255),
    employee_id BIGINT,
    message VARCHAR(255),
    job_time FLOAT
    );
