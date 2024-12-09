package com.db.modeler.service;

import com.db.modeler.model.Category;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final Map<String, Category> categories = new HashMap<>();

    public List<Category> getAllCategories() {
        return new ArrayList<>(categories.values());
    }

    public Optional<Category> getCategoryById(String id) {
        return Optional.ofNullable(categories.get(id));
    }

    public Category createCategory(Category category) {
        if (category.getId() == null) {
            category.setId(UUID.randomUUID().toString());
        }
        category.setCreatedAt(System.currentTimeMillis());
        category.setUpdatedAt(System.currentTimeMillis());
        categories.put(category.getId(), category);
        return category;
    }

    public Category updateCategory(String id, Category category) {
        if (!categories.containsKey(id)) {
            throw new RuntimeException("Category not found: " + id);
        }
        category.setId(id);
        category.setUpdatedAt(System.currentTimeMillis());
        categories.put(id, category);
        return category;
    }

    public void deleteCategory(String id) {
        categories.remove(id);
    }

    public List<Category> batchCreateOrUpdateCategories(List<Category> categoryList) {
        return categoryList.stream()
                .map(category -> {
                    if (category.getId() != null && categories.containsKey(category.getId())) {
                        return updateCategory(category.getId(), category);
                    } else {
                        return createCategory(category);
                    }
                })
                .collect(Collectors.toList());
    }

    public List<Category> getCategoryTree() {
        List<Category> allCategories = getAllCategories();
        Map<String, List<Category>> childrenMap = new HashMap<>();
        List<Category> rootCategories = new ArrayList<>();

        // 按父ID分组
        for (Category category : allCategories) {
            String parentId = category.getParentId();
            if (parentId == null) {
                rootCategories.add(category);
            } else {
                childrenMap.computeIfAbsent(parentId, k -> new ArrayList<>()).add(category);
            }
        }

        // 递归构建树
        buildCategoryTree(rootCategories, childrenMap);
        return rootCategories;
    }

    private void buildCategoryTree(List<Category> categories, Map<String, List<Category>> childrenMap) {
        for (Category category : categories) {
            List<Category> children = childrenMap.get(category.getId());
            if (children != null) {
                category.setChildren(children);
                buildCategoryTree(children, childrenMap);
            }
        }
    }
}
