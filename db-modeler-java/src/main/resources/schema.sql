-- 创建数据库
CREATE DATABASE IF NOT EXISTS pdmaner;

-- 使用数据库
USE pdmaner;

-- 创建租户表
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_tenant_name (name),
    UNIQUE KEY uk_tenant_code (code)
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
CREATE TABLE IF NOT EXISTS database_configs (
    id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    database_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uk_database_config_name_per_project (project_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建表设计表
CREATE TABLE IF NOT EXISTS table_designs (
    id VARCHAR(36) NOT NULL,
    code VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    comment TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'TABLE',
    domain VARCHAR(20) NOT NULL DEFAULT 'BUSINESS',
    columns TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    metadata TEXT,
    created_by VARCHAR(36),
    synced BOOLEAN DEFAULT FALSE,
    project_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uk_table_design_code_per_project (project_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
