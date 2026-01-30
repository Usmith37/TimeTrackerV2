package com.example.employees_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeCreateDto {
// Для update лучше создать отдельный ДТО и в нем сделать несколько методов для апдейта каждого поля
 //   private Long id;

    private String surname;

    private String name;

    private String patronymic;

    private Long stuffId;

    private String employeePost;

    private String role;

    private String login;

    private String password;

//    private LocalDate date;
}
