package com.clb.template.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TemplateTag {
    private String id;
    private String templateId;
    private String tagId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
