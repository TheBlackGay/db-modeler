package com.db.modeler.controller;

import com.db.modeler.model.FieldTemplate;
import com.db.modeler.service.FieldTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/field-templates")
public class FieldTemplateController {

    @Autowired
    private FieldTemplateService fieldTemplateService;

    @GetMapping
    public ResponseEntity<List<FieldTemplate>> getAllTemplates() {
        return ResponseEntity.ok(fieldTemplateService.getAllTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FieldTemplate> getTemplateById(@PathVariable String id) {
        return fieldTemplateService.getTemplateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FieldTemplate> createTemplate(@RequestBody FieldTemplate template) {
        return ResponseEntity.ok(fieldTemplateService.createTemplate(template));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FieldTemplate> updateTemplate(@PathVariable String id, @RequestBody FieldTemplate template) {
        return ResponseEntity.ok(fieldTemplateService.updateTemplate(id, template));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        fieldTemplateService.deleteTemplate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/batch-delete")
    public ResponseEntity<Void> batchDeleteTemplates(@RequestBody List<String> ids) {
        fieldTemplateService.batchDeleteTemplates(ids);
        return ResponseEntity.ok().build();
    }
}
