package com.db.modeler.service;

import com.db.modeler.model.Tag;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TagService {

    private final Map<String, Tag> tags = new HashMap<>();

    public List<Tag> getAllTags() {
        return new ArrayList<>(tags.values());
    }

    public Optional<Tag> getTagById(String id) {
        return Optional.ofNullable(tags.get(id));
    }

    public Tag createTag(Tag tag) {
        if (tag.getId() == null) {
            tag.setId(UUID.randomUUID().toString());
        }
        tag.setCreatedAt(System.currentTimeMillis());
        tag.setUpdatedAt(System.currentTimeMillis());
        tags.put(tag.getId(), tag);
        return tag;
    }

    public Tag updateTag(String id, Tag tag) {
        if (!tags.containsKey(id)) {
            throw new RuntimeException("Tag not found: " + id);
        }
        tag.setId(id);
        tag.setUpdatedAt(System.currentTimeMillis());
        tags.put(id, tag);
        return tag;
    }

    public void deleteTag(String id) {
        tags.remove(id);
    }

    public List<Tag> batchCreateOrUpdateTags(List<Tag> tagList) {
        return tagList.stream()
                .map(tag -> {
                    if (tag.getId() != null && tags.containsKey(tag.getId())) {
                        return updateTag(tag.getId(), tag);
                    } else {
                        return createTag(tag);
                    }
                })
                .collect(Collectors.toList());
    }
}
