package com.example.employees_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDto {

    private Long id;

    private String surname;

    private String name;

    private String patronymic;

    private Long stuffId;

    private String employeePost;

    private String role;

//    private String login;
//
    private String keycloakId;

    private LocalDate date;

    private String email;
}
