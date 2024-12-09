package com.clb.template.mapper;

import com.clb.template.entity.Tag;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TagMapper {
    
    @Insert("INSERT INTO tag (id, name, color, icon, description, created_at, updated_at) " +
            "VALUES (#{id}, #{name}, #{color}, #{icon}, #{description}, #{createdAt}, #{updatedAt})")
    void insert(Tag tag);
    
    @Update("UPDATE tag SET name = #{name}, color = #{color}, icon = #{icon}, " +
            "description = #{description}, updated_at = #{updatedAt} WHERE id = #{id}")
    void update(Tag tag);
    
    @Select("SELECT * FROM tag WHERE id = #{id}")
    Tag findById(@Param("id") String id);
    
    @Select("SELECT * FROM tag")
    List<Tag> findAll();
    
    @Delete("DELETE FROM tag WHERE id = #{id}")
    void delete(@Param("id") String id);
    
    @Select("SELECT t.* FROM tag t " +
            "INNER JOIN template_tag_relation ttr ON t.id = ttr.tag_id " +
            "WHERE ttr.template_id = #{templateId}")
    List<Tag> findByTemplateId(@Param("templateId") String templateId);
}
