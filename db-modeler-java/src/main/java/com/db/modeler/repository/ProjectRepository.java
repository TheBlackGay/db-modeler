package com.db.modeler.repository;

import com.db.modeler.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Mapper
@Repository
public interface ProjectRepository {
    Project findById(UUID id);
    List<Project> findByTenantId(@Param("tenantId") UUID tenantId);
    List<Project> findByTenantIdAndStatus(@Param("tenantId") UUID tenantId, @Param("status") Project.Status status);
    void save(Project project);
    void update(Project project);
    void deleteById(UUID id);
}
