CREATE TABLE IF NOT EXISTS field_template (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    default_value TEXT,
    required BOOLEAN,
    unique_field BOOLEAN,
    min_length INTEGER,
    max_length INTEGER,
    pattern VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tag (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS template_tag (
    template_id VARCHAR(36),
    tag_id VARCHAR(36),
    PRIMARY KEY (template_id, tag_id),
    FOREIGN KEY (template_id) REFERENCES field_template(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);
