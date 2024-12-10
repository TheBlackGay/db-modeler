package com.db.modeler.repository;

import com.db.modeler.model.FieldTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldTemplateRepository extends JpaRepository<FieldTemplate, String> {
    List<FieldTemplate> findByCategory(FieldTemplate.Category category);
    List<FieldTemplate> findByTagsContaining(String tag);
} 