package com.db.modeler.service;

import com.db.modeler.model.FieldTemplate;
import com.db.modeler.repository.FieldTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FieldTemplateService {

    @Autowired
    private FieldTemplateRepository fieldTemplateRepository;

    @Transactional
    public FieldTemplate createTemplate(FieldTemplate template) {
        // 设置ID和时间
        template.setId(UUID.randomUUID().toString());
        template.setCreateTime(LocalDateTime.now());
        
        // 保存模板
        fieldTemplateRepository.insert(template);
        return template;
    }

    @Transactional
    public FieldTemplate updateTemplate(String id, FieldTemplate template) {
        // 检查模板是否存在
        FieldTemplate existingTemplate = getTemplateById(id);
        if (existingTemplate == null) {
            throw new RuntimeException("Template not found: " + id);
        }

        // 更新基本信息
        template.setId(id);
        template.setCreateTime(existingTemplate.getCreateTime());
        
        // 保存更新
        fieldTemplateRepository.update(template);
        return template;
    }

    public FieldTemplate getTemplateById(String id) {
        FieldTemplate template = fieldTemplateRepository.findById(id);
        if (template == null) {
            throw new RuntimeException("Template not found: " + id);
        }
        return template;
    }

    public List<FieldTemplate> getAllTemplates() {
        return fieldTemplateRepository.findAll();
    }

    @Transactional
    public void deleteTemplate(String id) {
        fieldTemplateRepository.deleteById(id);
    }

    public List<FieldTemplate> getTemplatesByCategory(FieldTemplate.Category category) {
        return fieldTemplateRepository.findByCategory(category);
    }

    public List<FieldTemplate> getTemplatesByTag(String tag) {
        return fieldTemplateRepository.findByTagsContaining(tag);
    }
}
