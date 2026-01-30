package com.example.logentryservice.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogEntryDto {

    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String keycloakId;

    private Long employeeId;

    private String message;

    private Long jobTime;

    private LocalDate date;

}
