-- 创建数据库
CREATE DATABASE IF NOT EXISTS pdmaner;

-- 使用数据库
USE pdmaner;

-- 创建租户表
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_tenant_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) NOT NULL,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY uk_project_name_per_tenant (tenant_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建数据库配置表
CREATE TABLE IF NOT EXISTS db_configs (
    id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    dbType VARCHAR(20) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INACTIVE',
    last_sync DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    UNIQUE KEY uk_db_name_per_project (project_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建表设计表
CREATE TABLE IF NOT EXISTS table_designs (
    id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    comment TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'TABLE',
    columns JSON NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    UNIQUE KEY uk_table_name_per_project (project_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
