package com.example.employees_service.repository;

import com.example.employees_service.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    public Optional<Employee> findByKeycloakId(String keycloakId);
}
