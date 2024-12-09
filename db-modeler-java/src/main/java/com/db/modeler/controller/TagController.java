package com.db.modeler.controller;

import com.db.modeler.model.Tag;
import com.db.modeler.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable String id) {
        return tagService.getTagById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        return ResponseEntity.ok(tagService.createTag(tag));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable String id, @RequestBody Tag tag) {
        return ResponseEntity.ok(tagService.updateTag(id, tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable String id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/batch")
    public ResponseEntity<List<Tag>> batchCreateOrUpdateTags(@RequestBody List<Tag> tags) {
        return ResponseEntity.ok(tagService.batchCreateOrUpdateTags(tags));
    }
}
