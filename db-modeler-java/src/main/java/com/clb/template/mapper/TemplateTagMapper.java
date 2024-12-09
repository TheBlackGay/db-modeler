package com.clb.template.mapper;

import com.clb.template.entity.TemplateTag;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TemplateTagMapper {
    @Insert("INSERT INTO template_tag_relation (id, template_id, tag_id, created_at, updated_at) " +
            "VALUES (#{id}, #{templateId}, #{tagId}, #{createdAt}, #{updatedAt})")
    void insert(TemplateTag templateTag);

    @Delete("DELETE FROM template_tag_relation WHERE template_id = #{templateId}")
    void deleteByTemplateId(@Param("templateId") String templateId);

    @Delete("DELETE FROM template_tag_relation WHERE tag_id = #{tagId}")
    void deleteByTagId(@Param("tagId") String tagId);

    @Select("SELECT * FROM template_tag_relation WHERE template_id = #{templateId}")
    List<TemplateTag> findByTemplateId(@Param("templateId") String templateId);

    @Select("SELECT * FROM template_tag_relation WHERE tag_id = #{tagId}")
    List<TemplateTag> findByTagId(@Param("tagId") String tagId);
}
