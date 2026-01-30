package com.example.employees_service.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Builder
public record EmployeeWithEntryDto (Long id,
                                    String surname,
                                    String name,
                                    String patronymic,
                                    Long stuffId,
                                    String employeePost,
                                    String role,
                                    LocalDate date,
                                    List<LogEntry> logEntries){


}
