package com.db.modeler.service;

import com.db.modeler.model.FieldTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FieldTemplateService {

    private final Map<String, FieldTemplate> templates = new HashMap<>();

    public List<FieldTemplate> getAllTemplates() {
        return new ArrayList<>(templates.values());
    }

    public Optional<FieldTemplate> getTemplateById(String id) {
        return Optional.ofNullable(templates.get(id));
    }

    public FieldTemplate createTemplate(FieldTemplate template) {
        if (template.getId() == null) {
            template.setId(UUID.randomUUID().toString());
        }
        template.setCreatedAt(System.currentTimeMillis());
        template.setUpdatedAt(System.currentTimeMillis());
        templates.put(template.getId(), template);
        return template;
    }

    public FieldTemplate updateTemplate(String id, FieldTemplate template) {
        if (!templates.containsKey(id)) {
            throw new RuntimeException("Template not found: " + id);
        }
        template.setId(id);
        template.setUpdatedAt(System.currentTimeMillis());
        templates.put(id, template);
        return template;
    }

    public void deleteTemplate(String id) {
        templates.remove(id);
    }

    public void batchDeleteTemplates(List<String> ids) {
        ids.forEach(templates::remove);
    }
}
