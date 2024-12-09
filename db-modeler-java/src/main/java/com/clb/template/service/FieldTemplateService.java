package com.clb.template.service;

import com.clb.template.dto.FieldTemplateDTO;
import com.clb.template.entity.FieldTemplate;
import com.clb.template.entity.Tag;
import com.clb.template.repository.FieldTemplateMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FieldTemplateService {
    
    private final FieldTemplateMapper fieldTemplateMapper;
    private final TagService tagService;

    @Transactional(readOnly = true)
    public FieldTemplateDTO findById(String id) {
        FieldTemplate template = fieldTemplateMapper.findById(id);
        if (template != null) {
            List<Tag> tags = fieldTemplateMapper.findTagsByFieldTemplateId(id);
            template.setTags(tags);
        }
        return FieldTemplateDTO.fromEntity(template);
    }

    @Transactional(readOnly = true)
    public List<FieldTemplateDTO> findAll() {
        List<FieldTemplate> templates = fieldTemplateMapper.findAll();
        for (FieldTemplate template : templates) {
            List<Tag> tags = fieldTemplateMapper.findTagsByFieldTemplateId(template.getId());
            template.setTags(tags);
        }
        return templates.stream()
                .map(FieldTemplateDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public FieldTemplateDTO create(FieldTemplateDTO dto) {
        FieldTemplate template = dto.toEntity();
        template.setId(UUID.randomUUID().toString());
        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());
        
        fieldTemplateMapper.insert(template);
        
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            for (String tagId : dto.getTagIds()) {
                fieldTemplateMapper.addTag(template.getId(), tagId);
            }
        }
        
        return findById(template.getId());
    }

    @Transactional
    public FieldTemplateDTO update(String id, FieldTemplateDTO dto) {
        FieldTemplate existingTemplate = fieldTemplateMapper.findById(id);
        if (existingTemplate == null) {
            throw new RuntimeException("Field template not found with id: " + id);
        }

        FieldTemplate template = dto.toEntity();
        template.setId(id);
        template.setCreatedAt(existingTemplate.getCreatedAt());
        template.setUpdatedAt(LocalDateTime.now());
        
        fieldTemplateMapper.update(template);
        
        // Update tags
        fieldTemplateMapper.removeAllTags(id);
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            for (String tagId : dto.getTagIds()) {
                fieldTemplateMapper.addTag(id, tagId);
            }
        }
        
        return findById(id);
    }

    @Transactional
    public void delete(String id) {
        fieldTemplateMapper.removeAllTags(id);
        fieldTemplateMapper.delete(id);
    }

    @Transactional
    public void addTag(String fieldTemplateId, String tagId) {
        fieldTemplateMapper.addTag(fieldTemplateId, tagId);
    }

    @Transactional
    public void removeTag(String fieldTemplateId, String tagId) {
        fieldTemplateMapper.removeTag(fieldTemplateId, tagId);
    }
}
