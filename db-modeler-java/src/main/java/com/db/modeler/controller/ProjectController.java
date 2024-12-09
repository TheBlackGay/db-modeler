package com.db.modeler.controller;

import com.db.modeler.common.ApiResponse;
import com.db.modeler.common.PageResult;
import com.db.modeler.common.PageInfo;
import com.db.modeler.entity.Project;
import com.db.modeler.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ApiResponse<Project> createProject(@RequestBody Project project) {
        if (!isValidProject(project)) {
            return ApiResponse.error("Invalid project data");
        }
        try {
            Project createdProject = projectService.createProject(project);
            return ApiResponse.success(createdProject);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create project: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<Project> getProjectById(@PathVariable UUID id) {
        try {
            Project project = projectService.getProjectById(id);
            return ApiResponse.success(project);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get project: " + e.getMessage());
        }
    }

    @GetMapping
    public ApiResponse<List<Project>> getAllProjects(
            @RequestParam(required = false) UUID tenantId) {
        if (tenantId != null) {
            try {
                List<Project> projects = projectService.getProjectsByTenantId(tenantId);
                return ApiResponse.success(projects);
            } catch (Exception e) {
                return ApiResponse.error("Failed to get projects: " + e.getMessage());
            }
        }
        try {
            List<Project> projects = projectService.getAllProjects();
            return ApiResponse.success(projects);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get projects: " + e.getMessage());
        }
    }

    @GetMapping("/page")
    public ApiResponse<PageResult<Project>> getProjectsPage(
            @RequestParam UUID tenantId,
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int pageSize) {
        try {
            PageResult<Project> pageResult = projectService.getProjectsPage(tenantId, current, pageSize);
            return ApiResponse.success(pageResult);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get projects: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<Project> updateProject(@PathVariable UUID id, @RequestBody Project project) {
        if (!isValidProject(project)) {
            return ApiResponse.error("Invalid project data");
        }
        try {
            project.setId(id);
            Project updatedProject = projectService.updateProject(project);
            return ApiResponse.success(updatedProject);
        } catch (Exception e) {
            return ApiResponse.error("Failed to update project: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable UUID id) {
        try {
            projectService.deleteProject(id);
            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete project: " + e.getMessage());
        }
    }

    private boolean isValidProject(Project project) {
        return project != null && 
               StringUtils.hasText(project.getName()) && 
               project.getTenantId() != null;
    }
}
