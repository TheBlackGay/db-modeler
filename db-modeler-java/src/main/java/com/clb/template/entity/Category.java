package com.clb.template.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Category {
    private String id;

    private String name;

    private String icon;

    private String description;

    private String parentId;

    private Integer order;

    private Boolean isSystem;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
