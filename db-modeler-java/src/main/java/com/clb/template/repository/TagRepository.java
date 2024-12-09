package com.clb.template.repository;

import com.clb.template.entity.Tag;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Mapper
public interface TagRepository {
    @Select("SELECT * FROM tag WHERE name = #{name}")
    Optional<Tag> findByName(String name);

    @Select("SELECT t.* FROM tag t JOIN template_tag tt ON t.id = tt.tag_id WHERE tt.template_id = #{templateId}")
    List<Tag> findByTemplateId(@Param("templateId") String templateId);

    @Select("SELECT t.id, COUNT(tt.template_id) as count FROM tag t " +
            "LEFT JOIN template_tag tt ON t.id = tt.tag_id " +
            "GROUP BY t.id")
    @MapKey("id")
    Map<String, Long> getTagUsageCounts();

    @Insert("INSERT INTO tag (id, name, created_at, updated_at) " +
            "VALUES (#{id}, #{name}, #{createdAt}, #{updatedAt})")
    void insert(Tag tag);

    @Update("UPDATE tag SET name = #{name}, updated_at = #{updatedAt} WHERE id = #{id}")
    void update(Tag tag);

    @Delete("DELETE FROM tag WHERE id = #{id}")
    void delete(String id);

    @Select("SELECT * FROM tag")
    List<Tag> findAll();

    @Select("SELECT * FROM tag WHERE id = #{id}")
    Optional<Tag> findById(String id);

    @Select("SELECT template_id FROM template_tag WHERE tag_id = #{tagId}")
    List<String> findTemplateIdsByTagId(@Param("tagId") String tagId);

    @Insert("INSERT INTO template_tag (template_id, tag_id) VALUES (#{templateId}, #{tagId})")
    void addTagToTemplate(@Param("templateId") String templateId, @Param("tagId") String tagId);

    @Delete("DELETE FROM template_tag WHERE template_id = #{templateId} AND tag_id = #{tagId}")
    void removeTagFromTemplate(@Param("templateId") String templateId, @Param("tagId") String tagId);
}
