package com.db.modeler.service.impl;

import com.db.modeler.entity.Project;
import com.db.modeler.mapper.ProjectMapper;
import com.db.modeler.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectMapper projectMapper;

    @Override
    @Transactional
    public Project createProject(Project project) {
        project.setId(UUID.randomUUID());
        project.setStatus(Project.Status.ACTIVE);
        project.setCreatedAt(new Date());
        project.setUpdatedAt(new Date());
        projectMapper.insertProject(project);
        return project;
    }

    @Override
    public Project getProjectById(UUID id) {
        return projectMapper.findProjectById(id);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectMapper.findAllProjects();
    }

    @Override
    public List<Project> getProjectsByTenantId(UUID tenantId) {
        return projectMapper.findProjectsByTenantId(tenantId);
    }

    @Override
    @Transactional
    public Project updateProject(Project project) {
        project.setUpdatedAt(new Date());
        projectMapper.updateProject(project);
        return project;
    }

    @Override
    @Transactional
    public void deleteProject(UUID id) {
        projectMapper.deleteProject(id);
    }
}
