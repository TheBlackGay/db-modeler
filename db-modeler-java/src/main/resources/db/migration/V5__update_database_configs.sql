-- 创建数据库配置表
CREATE TABLE IF NOT EXISTS database_configs (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    database_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- 创建索引
CREATE INDEX idx_database_configs_project_id ON database_configs(project_id);
CREATE INDEX idx_database_configs_status ON database_configs(status);

-- 添加约束
ALTER TABLE database_configs
    ADD CONSTRAINT ck_database_configs_type CHECK (type IN ('MYSQL', 'POSTGRESQL')),
    ADD CONSTRAINT ck_database_configs_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'DELETED'));
