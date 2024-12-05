package com.db.modeler.entity;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "data_mappings")
public class DataMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MappingType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SourceType sourceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetType targetType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.DRAFT;

    @Column(nullable = false, columnDefinition = "json")
    private String configuration;

    @Column(nullable = false, columnDefinition = "json")
    private String mappingRules;

    @Column(columnDefinition = "json")
    private String schedule;

    @Column
    private Date lastExecutionTime;

    @Column
    private Date nextExecutionTime;

    @Column
    private Integer executionCount = 0;

    @Column
    private Integer successCount = 0;

    @Column
    private Integer failureCount = 0;

    @Column
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
