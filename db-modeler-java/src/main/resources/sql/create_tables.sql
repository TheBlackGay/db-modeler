-- 删除已存在的表
DROP TABLE IF EXISTS field_templates;
DROP TABLE IF EXISTS field_template;
DROP TABLE IF EXISTS field_template_tags;
DROP TABLE IF EXISTS template_tag;
DROP TABLE IF EXISTS template_tag_relation;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS table_designs;
DROP TABLE IF EXISTS table_relations;
DROP TABLE IF EXISTS graph_layouts;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS database_configs;
DROP TABLE IF EXISTS tenants;

-- 创建租户表
CREATE TABLE tenants (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '租户名称',
    code VARCHAR(50) NOT NULL COMMENT '租户编码',
    description TEXT COMMENT '租户描述',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE,INACTIVE,DELETED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_tenants_code (code),
    INDEX idx_tenants_status (status),
    UNIQUE KEY uk_tenant_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户表';

-- 创建数据库配置表
CREATE TABLE database_configs (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    tenant_id VARCHAR(36) NOT NULL COMMENT '租户ID',
    name VARCHAR(100) NOT NULL COMMENT '配置名称',
    type VARCHAR(20) NOT NULL COMMENT '数据库类型：MYSQL,POSTGRESQL,ORACLE,SQLSERVER',
    host VARCHAR(255) NOT NULL COMMENT '主机地址',
    port INT NOT NULL COMMENT '端口号',
    database_name VARCHAR(100) NOT NULL COMMENT '数据库名',
    username VARCHAR(100) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    charset VARCHAR(20) DEFAULT 'utf8mb4' COMMENT '字符集',
    timezone VARCHAR(50) COMMENT '时区',
    options JSON COMMENT '其他配置选项',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_configs_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据库配置表';

-- 创建项目表
CREATE TABLE projects (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '项目名称',
    description TEXT COMMENT '项目描述',
    tenant_id VARCHAR(36) NOT NULL COMMENT '租户ID',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE,INACTIVE,DELETED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_projects_tenant (tenant_id),
    INDEX idx_projects_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

-- 创建项目成员表
CREATE TABLE project_members (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    project_id VARCHAR(36) NOT NULL COMMENT '项目ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    role VARCHAR(20) NOT NULL COMMENT '角色',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_members_project (project_id),
    INDEX idx_members_user (user_id),
    UNIQUE KEY uk_project_user (project_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目成员表';

-- 创建表设计表
CREATE TABLE table_designs (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    project_id VARCHAR(36) NOT NULL COMMENT '项目ID',
    code VARCHAR(64) NOT NULL COMMENT '表代码',
    display_name VARCHAR(100) NOT NULL COMMENT '显示名称',
    type VARCHAR(20) DEFAULT 'TABLE' COMMENT '类型：TABLE,VIEW',
    domain VARCHAR(20) DEFAULT 'BUSINESS' COMMENT '领域：BUSINESS,SYSTEM',
    comment TEXT COMMENT '表注释',
    columns JSON COMMENT '列定义',
    status VARCHAR(20) DEFAULT 'DRAFT' COMMENT '状态：DRAFT,ACTIVE,ARCHIVED',
    metadata JSON COMMENT '元数据',
    created_by VARCHAR(36) COMMENT '创建人',
    synced TINYINT(1) DEFAULT 0 COMMENT '是否已同步',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_tables_project (project_id),
    INDEX idx_tables_code (code),
    UNIQUE KEY uk_project_code (project_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='表设计';

-- 创建表关系表
CREATE TABLE table_relations (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    project_id VARCHAR(36) NOT NULL COMMENT '项目ID',
    source_table_id VARCHAR(36) NOT NULL COMMENT '源表ID',
    target_table_id VARCHAR(36) NOT NULL COMMENT '目标表ID',
    relation_type VARCHAR(20) NOT NULL COMMENT '关系类型：ONE_TO_ONE,ONE_TO_MANY,MANY_TO_MANY',
    source_fields JSON COMMENT '源表字段',
    target_fields JSON COMMENT '目标表字段',
    metadata JSON COMMENT '元数据',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_relations_project (project_id),
    INDEX idx_relations_source (source_table_id),
    INDEX idx_relations_target (target_table_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='表关系';

-- 创建图布局表
CREATE TABLE graph_layouts (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    project_id VARCHAR(36) NOT NULL COMMENT '项目ID',
    name VARCHAR(100) NOT NULL COMMENT '布局名称',
    description TEXT COMMENT '布局描述',
    layout_data JSON COMMENT '布局数据',
    is_default TINYINT(1) DEFAULT 0 COMMENT '是否默认布局',
    version INT DEFAULT 1 COMMENT '版本号',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_layouts_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图布局';

-- 创建标签表
CREATE TABLE tag (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    category VARCHAR(20) COMMENT '标签分类',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_tag_category (category),
    UNIQUE KEY uk_tag_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 创建模板标签表
CREATE TABLE template_tag (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    category VARCHAR(20) COMMENT '标签分类',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_template_tag_category (category),
    UNIQUE KEY uk_template_tag_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板标签表';

-- 创建模板标签关系表
CREATE TABLE template_tag_relation (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    template_id VARCHAR(36) NOT NULL COMMENT '模板ID',
    tag_id VARCHAR(36) NOT NULL COMMENT '标签ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_relation_template (template_id),
    INDEX idx_relation_tag (tag_id),
    UNIQUE KEY uk_template_tag (template_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板标签关系表';

-- 创建字段模板表
CREATE TABLE field_templates (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '模板名称',
    field_name VARCHAR(64) NOT NULL COMMENT '字段名',
    data_type VARCHAR(50) NOT NULL COMMENT '数据类型',
    length INT COMMENT '长度',
    `precision` INT COMMENT '精度',
    nullable TINYINT(1) DEFAULT 1 COMMENT '是否可空',
    primary_key TINYINT(1) DEFAULT 0 COMMENT '是否主键',
    auto_increment TINYINT(1) DEFAULT 0 COMMENT '是否自增',
    default_value TEXT COMMENT '默认值',
    comment TEXT COMMENT '注释',
    category VARCHAR(20) COMMENT '分类',
    tags JSON COMMENT '标签',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_templates_category (category),
    INDEX idx_templates_field_name (field_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字段模板表';