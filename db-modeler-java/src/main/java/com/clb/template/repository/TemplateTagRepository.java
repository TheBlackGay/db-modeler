package com.clb.template.repository;

import com.clb.template.entity.TemplateTag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TemplateTagRepository {
    @Select("SELECT * FROM template_tag WHERE template_id = #{templateId}")
    List<TemplateTag> findByTemplateId(@Param("templateId") String templateId);
    
    @Delete("DELETE FROM template_tag WHERE template_id = #{templateId}")
    void deleteByTemplateId(@Param("templateId") String templateId);
    
    @Delete("DELETE FROM template_tag WHERE tag_id = #{tagId}")
    void deleteByTagId(@Param("tagId") String tagId);
    
    @Delete("DELETE FROM template_tag WHERE template_id = #{templateId} AND tag_id IN (#{tagIds})")
    void deleteByTemplateIdAndTagIds(@Param("templateId") String templateId, @Param("tagIds") List<String> tagIds);

    void save(TemplateTag templateTag);
    void update(TemplateTag templateTag);
    List<TemplateTag> findAll();
}
