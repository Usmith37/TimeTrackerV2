package com.example.logentryservice.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "log_entries")
@Access(AccessType.FIELD)
public class LogEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "keycloak_id", nullable = false)
    private String keycloakId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "message")
    private String message;

    @Column(name = "job_time")
    private Long jobTime;
}
