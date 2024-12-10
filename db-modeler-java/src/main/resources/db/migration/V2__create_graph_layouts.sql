-- 创建图布局表
CREATE TABLE graph_layouts (
    id SERIAL PRIMARY KEY,
    graph_id INTEGER NOT NULL,
    layout_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (graph_id) REFERENCES graphs(id)
);

-- 创建索引
CREATE INDEX idx_graph_layouts_graph_id ON graph_layouts(graph_id);
