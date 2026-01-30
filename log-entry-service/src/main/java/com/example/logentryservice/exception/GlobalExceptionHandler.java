package com.example.logentryservice.exception;

import com.example.logentryservice.dto.response.DefaultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<DefaultResponse> handleShiftNotFound(EntityNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new DefaultResponse(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, List<String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.groupingBy(
                        error -> error.getField(),
                        Collectors.mapping(
                                error -> error.getDefaultMessage(),
                                Collectors.toList()
                        )
                ));

        return new ResponseEntity<>(Map.of("errors", errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityIsExistException.class)
    public ResponseEntity<DefaultResponse> handleEntityIsExistException(EntityIsExistException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT) // может быть статус поменять
                .body(new DefaultResponse(ex.getMessage()));
    }
}
