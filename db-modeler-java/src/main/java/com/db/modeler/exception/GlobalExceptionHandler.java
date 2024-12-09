package com.db.modeler.exception;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Autowired
    private Environment env;

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Not Found");
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalOperationException.class)
    public ResponseEntity<?> handleIllegalOperationException(IllegalOperationException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Invalid Operation");
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleValidationException(ValidationException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Validation Error");
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DatabaseConfigValidationException.class)
    public ResponseEntity<?> handleDatabaseConfigValidationException(DatabaseConfigValidationException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Database Configuration Validation Error");
        response.put("field", ex.getField());
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        // 记录详细错误日志
        logger.error("Unexpected error occurred", ex);
        
        Map<String, String> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", ex.getMessage());
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        
        // 在开发环境下返回更详细的错误信息
        if (isDevelopmentProfile()) {
            response.put("debug_message", ex.toString());
            response.put("stack_trace", getStackTrace(ex));
        }
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    private boolean isDevelopmentProfile() {
        return Arrays.asList(env.getActiveProfiles()).contains("dev");
    }
    
    private String getStackTrace(Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        return sw.toString();
    }
}
