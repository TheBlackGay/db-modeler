package com.db.modeler.repository;

import com.db.modeler.model.FieldTemplate;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FieldTemplateRepository {
    List<FieldTemplate> findAll();
    
    FieldTemplate findById(String id);
    
    List<FieldTemplate> findByCategory(FieldTemplate.Category category);
    
    List<FieldTemplate> findByTagsContaining(String tag);
    
    void insert(FieldTemplate template);
    
    void update(FieldTemplate template);
    
    void deleteById(String id);
} 