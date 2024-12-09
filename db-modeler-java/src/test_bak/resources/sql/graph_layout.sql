CREATE TABLE IF NOT EXISTS graph_layout (
    id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    layout_data TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (id),
    UNIQUE KEY uk_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
