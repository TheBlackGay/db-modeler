package com.clb.template.controller;

import com.clb.template.entity.Category;
import com.clb.template.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/root")
    public ResponseEntity<List<Category>> getRootCategories() {
        return ResponseEntity.ok(categoryService.getRootCategories());
    }

    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<Category>> getSubCategories(@PathVariable String parentId) {
        return ResponseEntity.ok(categoryService.getSubCategories(parentId));
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable String id,
            @RequestBody Category category
    ) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
