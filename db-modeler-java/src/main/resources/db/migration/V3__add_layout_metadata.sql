-- 添加布局元数据字段
ALTER TABLE graph_layouts
ADD COLUMN name VARCHAR(100),
ADD COLUMN description TEXT,
ADD COLUMN is_default BOOLEAN DEFAULT false,
ADD COLUMN version INTEGER DEFAULT 1;

-- 创建唯一索引确保每个图只有一个默认布局
CREATE UNIQUE INDEX idx_graph_layouts_default 
ON graph_layouts(graph_id) 
WHERE is_default = true;

-- 添加版本控制约束
ALTER TABLE graph_layouts
ADD CONSTRAINT check_version_positive 
CHECK (version > 0); 