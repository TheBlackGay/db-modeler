CREATE TABLE IF NOT EXISTS table_relation (
    id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    source_table_id VARCHAR(36) NOT NULL,
    target_table_id VARCHAR(36) NOT NULL,
    relation_type VARCHAR(20) NOT NULL,
    column_mappings JSON,
    description TEXT,
    created_by VARCHAR(36),
    created_at BIGINT,
    updated_at BIGINT,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id),
    INDEX idx_source_table_id (source_table_id),
    INDEX idx_target_table_id (target_table_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
