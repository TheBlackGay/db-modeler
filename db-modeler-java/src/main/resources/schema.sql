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
    project_id VARCHAR(36) NOT NULL,
    database_config_id VARCHAR(36),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    table_schema TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    version INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (database_config_id) REFERENCES database_configs(id) ON DELETE SET NULL,
    UNIQUE KEY uk_table_design_name_per_project (project_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
