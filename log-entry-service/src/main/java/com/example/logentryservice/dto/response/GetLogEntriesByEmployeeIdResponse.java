package com.example.logentryservice.dto.response;

import com.example.logentryservice.model.LogEntry;

import java.util.List;

public record GetLogEntriesByEmployeeIdResponse(List<LogEntry> logEntryList) {
}
