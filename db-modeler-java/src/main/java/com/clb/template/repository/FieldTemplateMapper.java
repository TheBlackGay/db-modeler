package com.clb.template.repository;

import com.clb.template.entity.FieldTemplate;
import com.clb.template.entity.Tag;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FieldTemplateMapper {
    
    @Select("SELECT * FROM field_template WHERE id = #{id}")
    FieldTemplate findById(String id);
    
    @Select("SELECT * FROM field_template")
    List<FieldTemplate> findAll();
    
    @Insert("INSERT INTO field_template (id, name, description, type, default_value, required, unique, min_length, max_length, pattern, created_at, updated_at) " +
            "VALUES (#{id}, #{name}, #{description}, #{type}, #{defaultValue}, #{required}, #{unique}, #{minLength}, #{maxLength}, #{pattern}, #{createdAt}, #{updatedAt})")
    void insert(FieldTemplate fieldTemplate);
    
    @Update("UPDATE field_template SET name = #{name}, description = #{description}, type = #{type}, " +
            "default_value = #{defaultValue}, required = #{required}, unique = #{unique}, " +
            "min_length = #{minLength}, max_length = #{maxLength}, pattern = #{pattern}, " +
            "updated_at = #{updatedAt} WHERE id = #{id}")
    void update(FieldTemplate fieldTemplate);
    
    @Delete("DELETE FROM field_template WHERE id = #{id}")
    void delete(String id);
    
    @Select("SELECT t.* FROM tag t " +
            "INNER JOIN field_template_tag ft ON t.id = ft.tag_id " +
            "WHERE ft.field_template_id = #{fieldTemplateId}")
    List<Tag> findTagsByFieldTemplateId(String fieldTemplateId);
    
    @Insert("INSERT INTO field_template_tag (field_template_id, tag_id) VALUES (#{fieldTemplateId}, #{tagId})")
    void addTag(@Param("fieldTemplateId") String fieldTemplateId, @Param("tagId") String tagId);
    
    @Delete("DELETE FROM field_template_tag WHERE field_template_id = #{fieldTemplateId} AND tag_id = #{tagId}")
    void removeTag(@Param("fieldTemplateId") String fieldTemplateId, @Param("tagId") String tagId);
    
    @Delete("DELETE FROM field_template_tag WHERE field_template_id = #{fieldTemplateId}")
    void removeAllTags(String fieldTemplateId);
}
