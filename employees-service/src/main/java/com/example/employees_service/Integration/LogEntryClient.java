package com.example.employees_service.Integration;

import com.example.employees_service.dto.LogEntryDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class LogEntryClient {
    private final RestClient restClient;

    public LogEntryClient(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("http://localhost:8080")
                .build();
    }

    public LogEntryDto getLogEntryById(Long id) {
        return restClient.get()
                .uri("/api/log_entries/{id}", id)
                .retrieve()
                .body(LogEntryDto.class);
    }
}
