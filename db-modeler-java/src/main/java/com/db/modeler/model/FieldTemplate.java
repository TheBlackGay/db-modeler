package com.db.modeler.model;

import lombok.Data;

import java.util.List;

@Data
public class FieldTemplate {
    private String id;
    private String name;
    private String description;
    private Field template;
    private Category category;
    private List<Tag> tags;
    private Long createdAt;
    private Long updatedAt;

    @Data
    public static class Field {
        private String name;
        private String type;
        private String dataType;
        private Integer length;
        private Integer precision;
        private Integer scale;
        private List<String> options;
        private String defaultValue;
        private String comment;
    }

    @Data
    public static class Category {
        private String id;
        private String name;
        private String description;
        private String icon;
        private Integer order;
        private String parentId;
        private Boolean isSystem;
        private Long createdAt;
        private Long updatedAt;
    }

    @Data
    public static class Tag {
        private String id;
        private String name;
        private String color;
        private String icon;
        private String description;
        private Long createdAt;
        private Long updatedAt;
    }
}
