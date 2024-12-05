package com.db.modeler.entity;

import java.util.UUID;

public class TableDesign {

    private UUID id;

    private String name;

    private String comment;

    private Type type = Type.TABLE;

    private String columns;

    private Status status = Status.DRAFT;

    private String metadata;

    private UUID createdBy;

    public enum Type {
        TABLE, VIEW, MATERIALIZED_VIEW
    }

    public enum Status {
        DRAFT, ACTIVE, ARCHIVED
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getComment() {
        return comment;
    }

    public Type getType() {
        return type;
    }

    public String getColumns() {
        return columns;
    }

    public Status getStatus() {
        return status;
    }

    public String getMetadata() {
        return metadata;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public void setColumns(String columns) {
        this.columns = columns;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
}
