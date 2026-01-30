package com.example.employees_service.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "employees")
@Access(AccessType.FIELD)
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "patronymic", nullable = false)
    private String patronymic;

    @Column(name = "stuff_id", nullable = false)
    private Long stuffId;

    @Column(name = "employee_post", nullable = false)
    private String employeePost;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "login", nullable = false)
    private String login;

    @Column(name = "keycloak_id", nullable = false)
    private String keycloakId;

    @Column(name = "email", nullable = false)
    private String email;

}
