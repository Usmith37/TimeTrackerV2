package com.example.logentryservice.Integration;

import com.example.logentryservice.dto.EmployeeDto;
import com.example.logentryservice.dto.EmployeeIDDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.List;

@Service
public class EmployeesClient {
    private final RestClient restClient;

    //todo проверка туду
    public EmployeesClient(RestClient.Builder builder,
                           @Value("${integration.employee-url}") String employeeUrl) {
        this.restClient = builder
                .baseUrl(employeeUrl)
                .build();
    }

    public EmployeeIDDto getEmployeeById(String id) {
        return restClient.get()
                .uri("/api/employees/{id}", id)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                    throw new RuntimeException("id not found");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                    throw new RuntimeException("Server error in EmployeesClient " + id);
                })
                .body(EmployeeIDDto.class);
    }

    public List<EmployeeDto> getAllEmployees() {
        EmployeeDto[] employeesArray = restClient.get()
                .uri("/api/employees")
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                    throw new RuntimeException("Employees not found");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                    throw new RuntimeException("Server error in EmployeesClient");
                })
                .body(EmployeeDto[].class);

        return Arrays.asList(employeesArray);
    }

//    public List<EmployeeDto> getAllEmployees() {
//        return restClient.get()
//                .uri("/api/employees")
//                .retrieve()
//                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
//                    throw new RuntimeException("id not found");
//                })
//                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
//                    throw new RuntimeException("Server error in EmployeesClient ");
//                })
//                .bodyToFlux(EmployeeDto.class)
//                .collectList()
//                .block();
//    }
}
