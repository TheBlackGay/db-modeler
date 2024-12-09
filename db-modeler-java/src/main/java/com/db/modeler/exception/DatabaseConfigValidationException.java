package com.db.modeler.exception;

public class DatabaseConfigValidationException extends RuntimeException {
    private final String field;
    private final String message;

    public DatabaseConfigValidationException(String field, String message) {
        super(String.format("Validation failed for field '%s': %s", field, message));
        this.field = field;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
