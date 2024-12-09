package com.clb.template.dto;

import com.clb.template.entity.FieldTemplate;
import com.clb.template.entity.Tag;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class FieldTemplateDTO {
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
    private List<String> tagIds;

    public static FieldTemplateDTO fromEntity(FieldTemplate entity) {
        FieldTemplateDTO dto = new FieldTemplateDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setType(entity.getType());
        dto.setDefaultValue(entity.getDefaultValue());
        dto.setRequired(entity.getRequired());
        dto.setUnique(entity.getUnique());
        dto.setMinLength(entity.getMinLength());
        dto.setMaxLength(entity.getMaxLength());
        dto.setPattern(entity.getPattern());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getTags() != null) {
            dto.setTagIds(entity.getTags().stream().map(Tag::getId).collect(java.util.stream.Collectors.toList()));
        }
        return dto;
    }

    public FieldTemplate toEntity() {
        FieldTemplate entity = new FieldTemplate();
        entity.setId(getId());
        entity.setName(getName());
        entity.setDescription(getDescription());
        entity.setType(getType());
        entity.setDefaultValue(getDefaultValue());
        entity.setRequired(getRequired());
        entity.setUnique(getUnique());
        entity.setMinLength(getMinLength());
        entity.setMaxLength(getMaxLength());
        entity.setPattern(getPattern());
        entity.setCreatedAt(getCreatedAt());
        entity.setUpdatedAt(getUpdatedAt());
        return entity;
    }
}
