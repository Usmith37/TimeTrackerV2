package com.example.logentryservice.dto.request;

import jakarta.validation.constraints.*;

public record StartRequest(
//        @Min(value = 1, message = "Поле должно быть более 0")
        String keycloakId) {
}
