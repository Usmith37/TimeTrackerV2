package com.example.logentryservice.service;

import com.example.logentryservice.Integration.EmployeesClient;
import com.example.logentryservice.Repository.LogEntryRepository;
import com.example.logentryservice.dto.EmployeeDto;
import com.example.logentryservice.dto.MessageDto;
import com.example.logentryservice.model.LogEntry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class LogEntryScheduler {

    private final LogEntryRepository logEntryRepository;
    private final MessageProducer producer;
    private final EmployeesClient employeesClient;

    @Scheduled(cron = "${scheduler.need-close-cron}")
    public void findNotClosedLogEntries() {
        log.info("Scheduler оповещающий о незавершенных сменах начал работу");
        List<LogEntry> openEntries = logEntryRepository.findByEndTimeIsNull();
        openEntries.forEach(entry -> {
            System.out.println("KeycloakId(): " + entry.getKeycloakId());
            producer.sendNeedClose(new MessageDto(entry.getKeycloakId()));
        });
    }

    @Scheduled(cron = "${scheduler.need-open-cron}")
    public void findNotOpenLogEntries() {
        log.info("Scheduler оповещающий о неначатых сменах начал работу");
        List<EmployeeDto> employees = employeesClient.getAllEmployees().stream()
                .filter(e -> !"ROLE_ADMIN".equalsIgnoreCase(e.getRole()))
                .collect(Collectors.toList());;
        if (employees.isEmpty()) return;

        LocalDateTime shiftStart = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime shiftEnd = LocalDateTime.now().with(LocalTime.MAX);

        List<LogEntry> allLogs = logEntryRepository.findByStartTimeBetween(shiftStart, shiftEnd);

        Map<Long, List<LogEntry>> logsByEmployee = allLogs.stream()
                .collect(Collectors.groupingBy(LogEntry::getEmployeeId));

        for (EmployeeDto employee : employees) {
            List<LogEntry> logs = logsByEmployee.getOrDefault(employee.getStuffId(), List.of());

            if (logs.isEmpty()) {
                System.out.println("Не начата смена для сотрудника: " + employee.getName());
                producer.sendNeedOpen(new MessageDto(employee.getKeycloakId()));
            }
        }
    }
}
