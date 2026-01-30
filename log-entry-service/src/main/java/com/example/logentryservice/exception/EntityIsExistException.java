package com.example.logentryservice.exception;

public class EntityIsExistException extends RuntimeException {
    public EntityIsExistException(String message) {
        super(message);
    }
}
