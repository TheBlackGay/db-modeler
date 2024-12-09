package com.db.modeler.service;

import com.db.modeler.entity.Project;
import com.db.modeler.common.PageResult;
import com.db.modeler.common.PageInfo;

import java.util.List;
import java.util.UUID;

public interface ProjectService {
    /**
     * 创建新项目
     */
    Project createProject(Project project);
    
    /**
     * 根据ID获取项目
     */
    Project getProjectById(UUID id);
    
    /**
     * 获取所有项目
     */
    List<Project> getAllProjects();
    
    /**
     * 获取租户下的所有项目
     */
    List<Project> getProjectsByTenantId(UUID tenantId);
    
    /**
     * 分页获取租户下的所有项目
     */
    PageResult<Project> getProjectsPage(UUID tenantId, int current, int pageSize);
    
    /**
     * 更新项目信息
     */
    Project updateProject(Project project);
    
    /**
     * 删除项目
     */
    void deleteProject(UUID id);
}
