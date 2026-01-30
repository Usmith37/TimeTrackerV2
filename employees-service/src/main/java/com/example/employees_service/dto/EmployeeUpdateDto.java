package com.example.employees_service.dto;

import org.springframework.lang.Nullable;

public record EmployeeUpdateDto(
        @Nullable String surname,
        @Nullable String name,
        @Nullable String patronymic,
        @Nullable Long stuffId,
        @Nullable String employeePost) {
}
