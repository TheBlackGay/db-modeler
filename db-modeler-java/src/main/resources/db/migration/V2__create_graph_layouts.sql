-- 创建图布局表
CREATE TABLE graph_layouts (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    layout_data TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- 创建索引
CREATE INDEX idx_graph_layouts_project_id ON graph_layouts(project_id);
