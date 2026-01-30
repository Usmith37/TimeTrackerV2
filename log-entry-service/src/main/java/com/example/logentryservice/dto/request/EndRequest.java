package com.example.logentryservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record EndRequest(
//        @Min(value = 1, message = "Поле должно быть более 0")
        String keycloakId,
        @Size(max = 255, message = "Поле должно быть не более 255 символов")
        String message) {

}
