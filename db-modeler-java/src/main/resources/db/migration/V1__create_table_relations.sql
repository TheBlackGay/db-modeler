-- 创建表关系表
CREATE TABLE table_relations (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    source_table_id UUID NOT NULL,
    target_table_id UUID NOT NULL,
    relation_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- 创建列映射表
CREATE TABLE table_relation_column_mappings (
    relation_id UUID NOT NULL,
    source_column_id UUID NOT NULL,
    target_column_id UUID NOT NULL,
    mapping_type VARCHAR(50),
    PRIMARY KEY (relation_id, source_column_id, target_column_id),
    FOREIGN KEY (relation_id) REFERENCES table_relations(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_table_relations_project_id ON table_relations(project_id);
CREATE INDEX idx_table_relations_source_table_id ON table_relations(source_table_id);
CREATE INDEX idx_table_relations_target_table_id ON table_relations(target_table_id);
CREATE INDEX idx_table_relations_relation_type ON table_relations(relation_type);
