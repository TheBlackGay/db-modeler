package com.db.modeler.service.impl;

import com.db.modeler.entity.Project;
import com.db.modeler.entity.Tenant;
import com.db.modeler.repository.ProjectRepository;
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
    private ProjectRepository projectRepository;

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
        projectRepository.save(project);
        return project;
    }

    @Override
    public Project getProjectById(UUID id) {
        Project project = projectRepository.findById(id);
        if (project == null) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        return project;
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findByTenantId(null);
    }

    @Override
    public List<Project> getProjectsByTenantId(UUID tenantId) {
        return projectRepository.findByTenantId(tenantId);
    }

    @Override
    @Transactional
    public Project updateProject(Project project) {
        validateProject(project);
        
        Project existingProject = getProjectById(project.getId());
        
        // Update fields
        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setStatus(project.getStatus());
        existingProject.setUpdatedAt(new Date());
        
        projectRepository.update(existingProject);
        return existingProject;
    }

    @Override
    @Transactional
    public void deleteProject(UUID id) {
        Project project = getProjectById(id);
        projectRepository.deleteById(id);
    }

    private void validateProject(Project project) {
        if (project == null) {
            throw new ValidationException("Project cannot be null");
        }
        if (!StringUtils.hasText(project.getName())) {
            throw new ValidationException("Project name is required");
        }
        if (project.getTenantId() == null) {
            throw new ValidationException("Tenant ID is required");
        }
    }
}
