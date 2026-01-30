package com.example.logentryservice.service;

import com.example.logentryservice.Integration.EmployeesClient;
import com.example.logentryservice.Repository.LogEntryRepository;
import com.example.logentryservice.dto.EmployeeIDDto;
import com.example.logentryservice.dto.LogEntryDto;
import com.example.logentryservice.dto.request.EndRequest;
import com.example.logentryservice.dto.request.StartRequest;
import com.example.logentryservice.dto.response.GetLogEntriesByEmployeeIdResponse;
import com.example.logentryservice.exception.EntityIsExistException;
import com.example.logentryservice.exception.EntityNotFoundException;
import com.example.logentryservice.model.LogEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogEntryService {

    private final LogEntryRepository logEntryRepository;
    private final EmployeesClient employeesClient;

    public Long startLogEntry(StartRequest request) {
        Optional<LogEntry> startLogEntry = logEntryRepository.findByKeycloakIdAndEndTimeIsNull(request.keycloakId());
        if (startLogEntry.isPresent()) {
            throw new EntityIsExistException("У Вас уже есть незавершенная смена");
        }
        EmployeeIDDto employeeDto = employeesClient.getEmployeeById(request.keycloakId());
        Long employeeId = employeeDto.getStuffId(); // Предполагаем, что EmployeeIDDto содержит поле id

        LogEntry logEntry = LogEntry.builder()
                .startTime(LocalDateTime.now())
                .keycloakId(request.keycloakId())
                .employeeId(employeeId)
                .build();
        LogEntry savedLogEntry = logEntryRepository.save(logEntry);
        return savedLogEntry.getId();
    }

    public void endLogEntry(EndRequest request) {
        LogEntry logEntry = logEntryRepository.findByKeycloakIdAndEndTimeIsNull(request.keycloakId())
                .orElseThrow(() -> new EntityNotFoundException("У Вас еще нет начатых смен"));
        logEntry.setEndTime(LocalDateTime.now());
        logEntry.setMessage(request.message());
        var duration = Duration.between(logEntry.getStartTime(), logEntry.getEndTime());
        logEntry.setJobTime(duration.toSeconds()); // позднее исправить на toHours() или toMinutes()
        logEntryRepository.save(logEntry);
    }

    public GetLogEntriesByEmployeeIdResponse getAllLogEntriesByEmployee(String keycloakId){
        List<LogEntry> logEntryList = logEntryRepository.findByKeycloakId(keycloakId);
        return new GetLogEntriesByEmployeeIdResponse(logEntryList);
    }

    public List<LogEntryDto> findAll() {
//        return employeesMapper.employeesListToEmployeesDTOList(employeesRepository.findAll());
        return logEntryRepository.findAll().stream()
                .map(logEntry -> LogEntryDto.builder()
                        .id(logEntry.getId())
                        .startTime(logEntry.getStartTime())
                        .endTime(logEntry.getEndTime())
                        .keycloakId(logEntry.getKeycloakId())
                        .employeeId(logEntry.getEmployeeId())
                        .message(logEntry.getMessage())
                        .jobTime(logEntry.getJobTime())
                        .date(LocalDate.now())
                        .build())
                .collect(Collectors.toList());
            }
}
