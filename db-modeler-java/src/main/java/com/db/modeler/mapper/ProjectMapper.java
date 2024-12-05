package com.db.modeler.mapper;

import com.db.modeler.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.UUID;

@Mapper
public interface ProjectMapper {
    void insertProject(Project project);
    
    Project findProjectById(UUID id);
    
    List<Project> findAllProjects();
    
    List<Project> findProjectsByTenantId(UUID tenantId);
    
    void updateProject(Project project);
    
    void deleteProject(UUID id);
}
