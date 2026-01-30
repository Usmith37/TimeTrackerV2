package com.example.logentryservice.controller;

import com.example.logentryservice.dto.LogEntryDto;
import com.example.logentryservice.dto.request.EndRequest;
import com.example.logentryservice.dto.request.StartRequest;
import com.example.logentryservice.dto.response.DefaultResponse;
import com.example.logentryservice.dto.response.GetLogEntriesByEmployeeIdResponse;
import com.example.logentryservice.dto.response.StartResponse;
import com.example.logentryservice.service.LogEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/log_entries")
@RequiredArgsConstructor
public class LogEntriesController {

    private final LogEntryService logEntryService;

    @PostMapping("/start")
    public ResponseEntity<StartResponse> startLogEntry(@RequestBody StartRequest request) {
        Long logEntryId = logEntryService.startLogEntry(request);
        StartResponse response = new StartResponse(logEntryId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/end")
    public ResponseEntity<DefaultResponse> endLogEntry(@RequestBody @Valid EndRequest request) {
        logEntryService.endLogEntry(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new DefaultResponse("Смена завершена"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetLogEntriesByEmployeeIdResponse> getLogEntry(@PathVariable("id") String id) {
        GetLogEntriesByEmployeeIdResponse response = logEntryService.getAllLogEntriesByEmployee(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @GetMapping()
    public ResponseEntity<List<LogEntryDto>> getAllLogEntries() {
        List<LogEntryDto> response = logEntryService.findAll();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}
