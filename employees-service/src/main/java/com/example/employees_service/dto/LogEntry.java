package com.example.employees_service.dto;

import java.time.LocalDateTime;

public record LogEntry (Long id,
                        LocalDateTime startTime,
                        LocalDateTime endTime,
                        Long employeeId,
                        String message,
                        Long jobTime){

}
