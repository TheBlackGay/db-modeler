package com.db.modeler.controller;

import com.db.modeler.common.ApiResponse;
import com.db.modeler.model.FieldTemplate;
import com.db.modeler.service.FieldTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/field-templates")
public class FieldTemplateController {

    @Autowired
    private FieldTemplateService fieldTemplateService;

    @GetMapping
    public ApiResponse<List<FieldTemplate>> getAllTemplates() {
        return ApiResponse.success(fieldTemplateService.getAllTemplates());
    }

    @GetMapping("/{id}")
    public ApiResponse<FieldTemplate> getTemplateById(@PathVariable String id) {
        return ApiResponse.success(fieldTemplateService.getTemplateById(id));
    }

    @PostMapping
    public ApiResponse<FieldTemplate> createTemplate(@RequestBody FieldTemplate template) {
        return ApiResponse.success(fieldTemplateService.createTemplate(template));
    }

    @PutMapping("/{id}")
    public ApiResponse<FieldTemplate> updateTemplate(
            @PathVariable String id,
            @RequestBody FieldTemplate template) {
        return ApiResponse.success(fieldTemplateService.updateTemplate(id, template));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTemplate(@PathVariable String id) {
        fieldTemplateService.deleteTemplate(id);
        return ApiResponse.success();
    }

    @GetMapping("/category/{category}")
    public ApiResponse<List<FieldTemplate>> getTemplatesByCategory(
            @PathVariable FieldTemplate.Category category) {
        return ApiResponse.success(fieldTemplateService.getTemplatesByCategory(category));
    }

    @GetMapping("/tag/{tag}")
    public ApiResponse<List<FieldTemplate>> getTemplatesByTag(@PathVariable String tag) {
        return ApiResponse.success(fieldTemplateService.getTemplatesByTag(tag));
    }
}
