package com.db.modeler.entity;

import java.util.Date;
import java.util.UUID;

public class DataMapping {

    private UUID id;

    private String name;

    private String description;

    private MappingType type;

    private SourceType sourceType;

    private TargetType targetType;

    private Status status = Status.DRAFT;

    private String configuration;

    private String mappingRules;

    private String schedule;

    private Date lastExecutionTime;

    private Date nextExecutionTime;

    private Integer executionCount = 0;

    private Integer successCount = 0;

    private Integer failureCount = 0;

    private Boolean isActive;

    public enum MappingType {
        TRANSFORMATION, MIGRATION, SYNCHRONIZATION, REPLICATION
    }

    public enum SourceType {
        DATABASE, API, FILE, SERVICE
    }

    public enum TargetType {
        DATABASE, API, FILE, SERVICE
    }

    public enum Status {
        DRAFT, ACTIVE, PAUSED, COMPLETED, FAILED
    }

    // Getters and setters omitted for brevity
}
