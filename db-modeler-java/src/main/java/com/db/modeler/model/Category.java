package com.db.modeler.model;

import lombok.Data;

import java.util.List;

@Data
public class Category {
    private String id;
    private String name;
    private String description;
    private String icon;
    private Integer order;
    private String parentId;
    private Boolean isSystem;
    private Long createdAt;
    private Long updatedAt;
    private List<Category> children;
}
