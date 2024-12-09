package com.clb.template.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldTemplate {
    private String id;
    private String name;
    private String description;
    private String type;
    private String defaultValue;
    private Boolean required;
    private Boolean unique;
    private Integer minLength;
    private Integer maxLength;
    private String pattern;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Tag> tags;
}
