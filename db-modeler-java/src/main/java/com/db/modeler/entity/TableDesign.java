package com.db.modeler.entity;

import java.time.LocalDateTime;
import java.util.UUID;

public class TableDesign {

    private UUID id;
    private String code;        // 表代码
    private String displayName; // 显示名称
    private String comment;     // 注释
    private Type type = Type.TABLE;
    private Domain domain = Domain.BUSINESS; // 所属域
    private String columns;     // 列定义（JSON格式）
    private Status status = Status.DRAFT;    // 表状态
    private String metadata;    // 其他元数据（JSON格式）
    private UUID createdBy;
    private boolean synced = false; // 是否已同步到数据库
    private UUID projectId;     // 所属项目ID
    private LocalDateTime createdAt;  // 创建时间
    private LocalDateTime updatedAt;  // 更新时间

    public enum Type {
        TABLE, VIEW
    }

    public enum Status {
        DRAFT, ACTIVE, ARCHIVED
    }

    public enum Domain {
        BUSINESS, SYSTEM
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getComment() {
        return comment;
    }

    public Type getType() {
        return type;
    }

    public Domain getDomain() {
        return domain;
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

    public boolean isSynced() {
        return synced;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
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

    public void setSynced(boolean synced) {
        this.synced = synced;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
