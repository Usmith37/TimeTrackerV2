package com.example.employees_service.service;

import com.example.employees_service.Integration.LogEntryClient;
import com.example.employees_service.dto.*;
import com.example.employees_service.model.Employee;
import com.example.employees_service.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final LogEntryClient logEntryClient;

    private final KeycloakUserService keycloakUserService;

    public List<EmployeeDto> findAll() {
//        return employeesMapper.employeesListToEmployeesDTOList(employeesRepository.findAll());
        return employeeRepository.findAll().stream()
                .map(employee -> EmployeeDto.builder()
                        .id(employee.getId())
                        .surname(employee.getSurname())
                        .name(employee.getName())
                        .patronymic(employee.getPatronymic())
                        .stuffId(employee.getStuffId())
                        .employeePost(employee.getEmployeePost())
                        .role(employee.getRole())
                        .date(LocalDate.now())
                        .keycloakId(employee.getKeycloakId())
                        .build())
                .collect(Collectors.toList());
    }

    public Optional<EmployeeDto> findById(String keycloak_id) {
//        return employeesRepository.findById(id)       // если надо через маппер
//                .map(employeesMapper::entityToDto);  // если надо через маппер
        return employeeRepository.findByKeycloakId(keycloak_id)
                .map(employee -> EmployeeDto.builder()
                        .id(employee.getId())
                        .surname(employee.getSurname())
                        .name(employee.getName())
                        .patronymic(employee.getPatronymic())
                        .stuffId(employee.getStuffId())
                        .employeePost(employee.getEmployeePost())
                        .role(employee.getRole())
                        .email(employee.getEmail())
                        .date(LocalDate.now())
                        .build());
    }

//    public EmployeeDto save(EmployeeCreateUpdateDto createEmployeeDTO) {
////        Employees employee = employeesMapper.dtoToEntity(createEmployeeDTO); // если через маппер, но не будет даты
//        Employee employee = Employee.builder()
//                .surname(createEmployeeDTO.getSurname())
//                .name(createEmployeeDTO.getName())
//                .patronymic(createEmployeeDTO.getPatronymic())
//                .stuffId(createEmployeeDTO.getStuffId())
//                .employeePost(createEmployeeDTO.getEmployeePost())
//                .role(createEmployeeDTO.getRole())
//                .login(createEmployeeDTO.getLogin())
//                .password(createEmployeeDTO.getPassword())
//                .build();
//        Employee savedEmployee = employeeRepository.save(employee);
////        return employeesMapper.entityToDto(savedEmployee); // если через маппер, но не будет даты
//        return EmployeeDto.builder()
//                .id(savedEmployee.getId())
//                .surname(savedEmployee.getSurname())
//                .name(savedEmployee.getName())
//                .patronymic(savedEmployee.getPatronymic())
//                .stuffId(savedEmployee.getStuffId())
//                .employeePost(savedEmployee.getEmployeePost())
//                .role(savedEmployee.getRole())
//                .date(LocalDate.now())
//                .build();
//    }

    public EmployeeDto save(EmployeeCreateDto dto) {
        // Добавляем в Keycloak
        String userId = keycloakUserService.createUser(
                dto.getLogin(),
                dto.getPassword(),
                dto.getRole().replace("ROLE_", "") // убираем префикс
        );

        // Сохраняю в свою БД
        Employee employee = Employee.builder()
                .surname(dto.getSurname())
                .name(dto.getName())
                .patronymic(dto.getPatronymic())
                .stuffId(dto.getStuffId())
                .employeePost(dto.getEmployeePost())
                .role(dto.getRole())
                .login(dto.getLogin())
                .keycloakId(userId)
                .build();

        Employee saved = employeeRepository.save(employee);

        return EmployeeDto.builder()
                .id(saved.getId())
                .surname(saved.getSurname())
                .name(saved.getName())
                .patronymic(saved.getPatronymic())
                .stuffId(saved.getStuffId())
                .employeePost(saved.getEmployeePost())
                .role(saved.getRole())
                .date(LocalDate.now())
                .build();
    }

    public EmployeeDto update(EmployeeUpdateDto employeeDTO, Long id) {
        return employeeRepository.findById(id)
                .map(foundEmployee -> {
                    applyUpdates(foundEmployee, employeeDTO);
                    Employee updatedEmployee = employeeRepository.save(foundEmployee);
                    return mapToDto(updatedEmployee);
                })
                .orElse(null);
    }

    private void applyUpdates(Employee employee, EmployeeUpdateDto dto) {
        if (dto.surname() != null) employee.setSurname(dto.surname());
        if (dto.name() != null) employee.setName(dto.name());
        if (dto.patronymic() != null) employee.setPatronymic(dto.patronymic());
        if (dto.stuffId() != null) employee.setStuffId(dto.stuffId());
        if (dto.employeePost() != null) employee.setEmployeePost(dto.employeePost());
    }

    private EmployeeDto mapToDto(Employee employee) {
        return EmployeeDto.builder()
                .id(employee.getId())
                .surname(employee.getSurname())
                .name(employee.getName())
                .patronymic(employee.getPatronymic())
                .stuffId(employee.getStuffId())
                .employeePost(employee.getEmployeePost())
                .role(employee.getRole())
                .date(LocalDate.now())
                .build();
    }

    public boolean deleteById(Long id) {

        Optional<Employee> employeeOpt = employeeRepository.findById(id);

        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();

            // удаляем пользователя из Keycloak
            if (employee.getKeycloakId() != null) {
                keycloakUserService.deleteUser(employee.getKeycloakId());
            }

            // удаляем из базы данных
            employeeRepository.deleteById(id);
            return true;
        }
//        if (employeeRepository.existsById(id)) {
//            employeeRepository.deleteById(id);
//            return true;
//        }
        return false;
    }

    public EmployeeWithEntryDto getEmployeeWithEntryById(Long id) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        LogEntryDto logEntryDto = logEntryClient.getLogEntryById(id);
        return EmployeeWithEntryDto.builder()
                .id(employee.getId())
                .surname(employee.getSurname())
                .name(employee.getName())
                .patronymic(employee.getPatronymic())
                .stuffId(employee.getStuffId())
                .employeePost(employee.getEmployeePost())
                .role(employee.getRole())
                .logEntries(logEntryDto.logEntryList())
                .build();
    }
}
