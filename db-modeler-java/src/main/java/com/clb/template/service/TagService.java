package com.clb.template.service;

import com.clb.template.entity.Tag;
import com.clb.template.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional
    public Tag createTag(Tag tag) {
        tag.setId(UUID.randomUUID().toString());
        LocalDateTime now = LocalDateTime.now();
        tag.setCreatedAt(now);
        tag.setUpdatedAt(now);
        tagRepository.insert(tag);
        return tag;
    }

    @Transactional
    public Tag updateTag(Tag tag) {
        tag.setUpdatedAt(LocalDateTime.now());
        tagRepository.update(tag);
        return tag;
    }

    public Tag getTagById(String id) {
        return tagRepository.findById(id).orElse(null);
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Transactional
    public void deleteTag(String id) {
        tagRepository.delete(id);
    }

    public List<Tag> getByIds(List<String> ids) {
        return ids.stream()
                .map(this::getTagById)
                .filter(tag -> tag != null)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getTagUsageCounts() {
        return tagRepository.getTagUsageCounts();
    }

    public List<Tag> getTemplateTagsById(String templateId) {
        return tagRepository.findByTemplateId(templateId);
    }

    @Transactional
    public void mergeTags(List<String> sourceTagIds, Tag newTag) {
        // 创建新标签
        Tag mergedTag = createTag(newTag);
        
        // 获取所有使用源标签的模板
        sourceTagIds.forEach(tagId -> {
            List<String> templateIds = tagRepository.findTemplateIdsByTagId(tagId);
            // 为每个模板添加新标签
            templateIds.forEach(templateId -> tagRepository.addTagToTemplate(templateId, mergedTag.getId()));
            // 删除旧标签
            deleteTag(tagId);
        });
    }
}
