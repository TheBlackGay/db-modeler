package com.db.modeler.mapper;

import com.db.modeler.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ProjectMapper {
    void insertProject(Project project);
    
    Project findProjectById(@Param("id") UUID id);
    
    List<Project> findAllProjects();
    
    List<Project> findProjectsByTenantId(@Param("tenantId") UUID tenantId);
    
    void updateProject(Project project);
    
    void deleteProject(@Param("id") UUID id);
    
    void deleteProjectsByTenantId(@Param("tenantId") UUID tenantId);
    
    List<Project> findProjectsByTenantIdWithPaging(@Param("tenantId") UUID tenantId, @Param("offset") int offset, @Param("pageSize") int pageSize);
    
    long countProjectsByTenantId(@Param("tenantId") UUID tenantId);
}
