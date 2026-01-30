package com.example.mailsender.Integration;

import com.example.mailsender.dto.EmployeeDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class EmployeesClient {
    private final RestClient restClient;

    public EmployeesClient(RestClient.Builder builder,
                           @Value("${integration.employee-url}") String employeeUrl) {
        this.restClient = builder
                .baseUrl(employeeUrl)
                .build();
    }

    public EmployeeDto getEmployeeById(String id) {
        return restClient.get()
                .uri("/api/employees/{id}", id)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                    throw new RuntimeException("id not found");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                    throw new RuntimeException("Server error in EmployeesClient " + id);
                })
                .body(EmployeeDto.class);
    }
}
