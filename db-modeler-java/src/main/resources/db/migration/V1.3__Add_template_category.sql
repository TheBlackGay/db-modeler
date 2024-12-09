CREATE TABLE template_category (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    parent_id VARCHAR(36),
    `order` INT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES template_category(id)
);

-- 插入默认的系统分类
INSERT INTO template_category (id, name, icon, is_system, `order`, created_at, updated_at)
VALUES
('common', '常用字段', 'StarOutlined', TRUE, 0, NOW(), NOW()),
('system', '系统字段', 'SettingOutlined', TRUE, 1, NOW(), NOW()),
('custom', '自定义字段', 'EditOutlined', TRUE, 2, NOW(), NOW());
