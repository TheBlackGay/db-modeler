-- 创建字段模板表
CREATE TABLE field_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    field_name VARCHAR(64) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    length INTEGER,
    precision INTEGER,
    nullable BOOLEAN DEFAULT true,
    primary_key BOOLEAN DEFAULT false,
    auto_increment BOOLEAN DEFAULT false,
    default_value TEXT,
    comment TEXT,
    category VARCHAR(20),
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建字段模板标签表
CREATE TABLE field_template_tags (
    template_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    FOREIGN KEY (template_id) REFERENCES field_templates(id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, tag)
);

-- 创建索引
CREATE INDEX idx_field_templates_category ON field_templates(category);
CREATE INDEX idx_field_templates_field_name ON field_templates(field_name);
CREATE INDEX idx_field_template_tags_tag ON field_template_tags(tag); 