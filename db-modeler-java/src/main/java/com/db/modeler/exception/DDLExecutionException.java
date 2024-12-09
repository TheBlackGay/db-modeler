package com.db.modeler.exception;

public class DDLExecutionException extends RuntimeException {
    public DDLExecutionException(String message) {
        super(message);
    }

    public DDLExecutionException(String message, Throwable cause) {
        super(message, cause);
    }
}
