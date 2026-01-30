package com.example.employees_service.controller;

import com.example.employees_service.dto.EmployeeCreateDto;
import com.example.employees_service.dto.EmployeeDto;
import com.example.employees_service.dto.EmployeeUpdateDto;
import com.example.employees_service.dto.EmployeeWithEntryDto;
import com.example.employees_service.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeesController {

    private final EmployeeService employeeService;

    @GetMapping()
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> employeeDtoList = employeeService.findAll();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(employeeDtoList);
    }

    @GetMapping("/{keycloakId}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("keycloakId") String keycloakId) {
        Optional<EmployeeDto> employeeDto = employeeService.findById(keycloakId);
        return employeeDto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/employeeEntry/{id}")
    public ResponseEntity<EmployeeWithEntryDto> getEmployeeWithEntryById(@PathVariable("id") Long id) {
        EmployeeWithEntryDto response = employeeService.getEmployeeWithEntryById(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @PostMapping()
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeCreateDto createEmployeeDTO) {
        EmployeeDto createdEmployee = employeeService.save(createEmployeeDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdEmployee);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@RequestBody EmployeeUpdateDto updateEmployeeDto,
                                                      @PathVariable Long id) {
        EmployeeDto updatedEmployee = employeeService.update(updateEmployeeDto, id);
        return updatedEmployee != null ? ResponseEntity.status(HttpStatus.OK).body(updatedEmployee) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        return employeeService.deleteById(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}
