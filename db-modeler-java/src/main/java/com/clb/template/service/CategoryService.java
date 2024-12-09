package com.clb.template.service;

import com.clb.template.entity.Category;
import com.clb.template.mapper.CategoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryMapper categoryMapper;

    public List<Category> getAllCategories() {
        logger.info("Fetching all categories");
        return categoryMapper.findAll();
    }

    public List<Category> getRootCategories() {
        logger.info("Fetching root categories");
        return categoryMapper.findRootCategories();
    }

    public List<Category> getSubCategories(String parentId) {
        logger.info("Fetching subcategories for parentId: {}", parentId);
        return categoryMapper.findByParentIdOrderByOrderAsc(parentId);
    }

    @Transactional
    public Category createCategory(Category category) {
        logger.info("Creating category: {}", category);
        // 如果是根分类，设置 parentId 为 null
        if (category.getParentId() != null && category.getParentId().isEmpty()) {
            category.setParentId(null);
        }
        // 设置ID和时间戳
        category.setId(UUID.randomUUID().toString());
        LocalDateTime now = LocalDateTime.now();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        categoryMapper.insert(category);
        logger.info("Category created successfully: {}", category);
        return category;
    }

    @Transactional
    public Category updateCategory(String id, Category category) {
        logger.info("Updating category with id: {}", id);
        Category existingCategory = categoryMapper.findById(id);
        if (existingCategory == null) {
            logger.error("Category not found: {}", id);
            throw new RuntimeException("分类不存在");
        }

        if (existingCategory.getIsSystem()) {
            logger.error("Cannot modify system category: {}", id);
            throw new RuntimeException("系统分类不能修改");
        }

        // 更新字段
        category.setId(id);
        category.setUpdatedAt(LocalDateTime.now());
        categoryMapper.update(category);
        logger.info("Category updated successfully: {}", category);
        return category;
    }

    @Transactional
    public void deleteCategory(String id) {
        logger.info("Deleting category with id: {}", id);
        Category category = categoryMapper.findById(id);
        if (category == null) {
            logger.error("Category not found: {}", id);
            throw new RuntimeException("分类不存在");
        }

        if (category.getIsSystem()) {
            logger.error("Cannot delete system category: {}", id);
            throw new RuntimeException("系统分类不能删除");
        }

        if (categoryMapper.existsByParentId(id)) {
            logger.error("Cannot delete category with children: {}", id);
            throw new RuntimeException("请先删除子分类");
        }

        categoryMapper.deleteById(id);
        logger.info("Category deleted successfully: {}", id);
    }
}
