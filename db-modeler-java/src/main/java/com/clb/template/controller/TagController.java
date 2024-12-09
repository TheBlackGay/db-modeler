package com.clb.template.controller;

import com.clb.template.entity.Tag;
import com.clb.template.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @GetMapping("/usage")
    public ResponseEntity<Map<String, Long>> getTagUsageCounts() {
        return ResponseEntity.ok(tagService.getTagUsageCounts());
    }

    @GetMapping("/template/{templateId}")
    public ResponseEntity<List<Tag>> getTemplateTagsById(@PathVariable String templateId) {
        return ResponseEntity.ok(tagService.getTemplateTagsById(templateId));
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        return ResponseEntity.ok(tagService.createTag(tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable String id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<Void> mergeTags(
            @RequestParam List<String> sourceTagIds,
            @RequestBody Tag newTag
    ) {
        tagService.mergeTags(sourceTagIds, newTag);
        return ResponseEntity.ok().build();
    }
}
