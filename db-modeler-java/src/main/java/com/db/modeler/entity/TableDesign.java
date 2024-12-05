package com.db.modeler.entity;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "table_designs")
public class TableDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type = Type.TABLE;

    @Column(nullable = false, columnDefinition = "json")
    private String columns;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.DRAFT;

    @Column(columnDefinition = "json")
    private String metadata;

    @Column
    private UUID createdBy;

    public enum Type {
        TABLE, VIEW, MATERIALIZED_VIEW
    }

    public enum Status {
        DRAFT, ACTIVE, ARCHIVED
    }

    // Getters and setters omitted for brevity
}
