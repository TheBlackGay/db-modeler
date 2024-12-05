package com.db.modeler.service.impl;

import com.db.modeler.entity.Project;
import com.db.modeler.entity.Tenant;
import com.db.modeler.mapper.ProjectMapper;
import com.db.modeler.service.ProjectService;
import com.db.modeler.service.TenantService;
import com.db.modeler.exception.ResourceNotFoundException;
import com.db.modeler.exception.ValidationException;
import com.db.modeler.exception.IllegalOperationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private TenantService tenantService;

    @Override
    @Transactional
    public Project createProject(Project project) {
        validateProject(project);
        
        // Verify tenant exists and is active
        Tenant tenant = tenantService.getTenantById(project.getTenantId());
        if (tenant.getStatus() != Tenant.Status.ACTIVE) {
            throw new IllegalOperationException("Cannot create project for inactive tenant");
        }
        
        project.setId(UUID.randomUUID());
        project.setStatus(Project.Status.ACTIVE);
        project.setCreatedAt(new Date());
        project.setUpdatedAt(new Date());
        projectMapper.insertProject(project);
        return project;
    }

    @Override
    public Project getProjectById(UUID id) {
        Project project = projectMapper.findProjectById(id);
        if (project == null) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        return project;
    }

    @Override
    public List<Project> getAllProjects() {
        return projectMapper.findAllProjects();
    }

    @Override
    public List<Project> getProjectsByTenantId(UUID tenantId) {
        // Verify tenant exists
        tenantService.getTenantById(tenantId);
        return projectMapper.findProjectsByTenantId(tenantId);
    }

    @Override
    @Transactional
    public Project updateProject(Project project) {
        if (project.getId() == null) {
            throw new ValidationException("Project ID cannot be null");
        }
        
        // Check if project exists
        Project existingProject = getProjectById(project.getId());
        
        // Verify tenant exists and is active
        Tenant tenant = tenantService.getTenantById(project.getTenantId());
        if (tenant.getStatus() != Tenant.Status.ACTIVE) {
            throw new IllegalOperationException("Cannot update project for inactive tenant");
        }
        
        validateProject(project);
        project.setUpdatedAt(new Date());
        projectMapper.updateProject(project);
        return project;
    }

    @Override
    @Transactional
    public void deleteProject(UUID id) {
        Project project = getProjectById(id);
        if (project.getStatus() == Project.Status.DELETED) {
            throw new IllegalOperationException("Project is already deleted");
        }
        
        // Soft delete the project
        project.setStatus(Project.Status.DELETED);
        project.setUpdatedAt(new Date());
        projectMapper.updateProject(project);
    }

    private void validateProject(Project project) {
        if (project == null) {
            throw new ValidationException("Project cannot be null");
        }
        if (project.getTenantId() == null) {
            throw new ValidationException("Tenant ID cannot be null");
        }
        if (!StringUtils.hasText(project.getName())) {
            throw new ValidationException("Project name cannot be empty");
        }
        if (project.getName().length() > 100) {
            throw new ValidationException("Project name cannot exceed 100 characters");
        }
        if (project.getDescription() != null && project.getDescription().length() > 500) {
            throw new ValidationException("Project description cannot exceed 500 characters");
        }
    }
}
