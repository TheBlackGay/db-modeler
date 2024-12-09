package com.clb.template.mapper;

import com.clb.template.entity.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CategoryMapper {
    
    @Insert("INSERT INTO category (id, name, parent_id, icon, description, order_num, is_system, created_at, updated_at) " +
            "VALUES (#{id}, #{name}, #{parentId}, #{icon}, #{description}, #{order}, #{isSystem}, #{createdAt}, #{updatedAt})")
    void insert(Category category);
    
    @Update("UPDATE category SET name = #{name}, parent_id = #{parentId}, icon = #{icon}, " +
            "description = #{description}, order_num = #{order}, updated_at = #{updatedAt} " +
            "WHERE id = #{id}")
    void update(Category category);
    
    @Select("SELECT * FROM category WHERE id = #{id}")
    Category findById(@Param("id") String id);
    
    @Select("SELECT * FROM category")
    List<Category> findAll();
    
    @Delete("DELETE FROM category WHERE id = #{id}")
    void deleteById(@Param("id") String id);
    
    @Select("SELECT * FROM category WHERE parent_id = #{parentId} ORDER BY order_num ASC")
    List<Category> findByParentIdOrderByOrderAsc(@Param("parentId") String parentId);
    
    @Select("SELECT * FROM category WHERE parent_id IS NULL ORDER BY order_num ASC")
    List<Category> findRootCategories();
    
    @Select("SELECT COUNT(*) > 0 FROM category WHERE parent_id = #{parentId}")
    boolean existsByParentId(@Param("parentId") String parentId);
}
