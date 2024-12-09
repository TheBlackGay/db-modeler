package com.db.modeler.model;

import lombok.Data;

@Data
public class Tag {
    private String id;
    private String name;
    private String color;
    private String icon;
    private String description;
    private Long createdAt;
    private Long updatedAt;
}
