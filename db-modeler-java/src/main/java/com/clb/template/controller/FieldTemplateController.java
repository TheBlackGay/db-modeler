package com.clb.template.controller;

import com.clb.template.dto.FieldTemplateDTO;
import com.clb.template.service.FieldTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/field-templates")
@RequiredArgsConstructor
public class FieldTemplateController {

    private final FieldTemplateService fieldTemplateService;

    @GetMapping
    public ResponseEntity<List<FieldTemplateDTO>> getAllTemplates() {
        return ResponseEntity.ok(fieldTemplateService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FieldTemplateDTO> getTemplate(@PathVariable String id) {
        FieldTemplateDTO template = fieldTemplateService.findById(id);
        if (template == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(template);
    }

    @PostMapping
    public ResponseEntity<FieldTemplateDTO> createTemplate(@Validated @RequestBody FieldTemplateDTO dto) {
        return ResponseEntity.ok(fieldTemplateService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FieldTemplateDTO> updateTemplate(
            @PathVariable String id,
            @Validated @RequestBody FieldTemplateDTO dto) {
        return ResponseEntity.ok(fieldTemplateService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        fieldTemplateService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{templateId}/tags/{tagId}")
    public ResponseEntity<Void> addTag(
            @PathVariable String templateId,
            @PathVariable String tagId) {
        fieldTemplateService.addTag(templateId, tagId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{templateId}/tags/{tagId}")
    public ResponseEntity<Void> removeTag(
            @PathVariable String templateId,
            @PathVariable String tagId) {
        fieldTemplateService.removeTag(templateId, tagId);
        return ResponseEntity.ok().build();
    }
}
