-- 创建标签表
CREATE TABLE template_tag (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20),
    icon VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- 创建模板标签关联表
CREATE TABLE template_tag_relation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL,
    tag_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (tag_id) REFERENCES template_tag(id),
    FOREIGN KEY (template_id) REFERENCES field_template(id),
    UNIQUE KEY unique_template_tag (template_id, tag_id)
);
