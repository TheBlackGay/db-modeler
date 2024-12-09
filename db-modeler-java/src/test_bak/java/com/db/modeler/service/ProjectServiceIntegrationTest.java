package com.db.modeler.service;

import com.db.modeler.entity.Project;
import com.db.modeler.entity.Tenant;
import com.db.modeler.mapper.ProjectMapper;
import com.db.modeler.mapper.TenantMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ProjectServiceIntegrationTest {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private TenantMapper tenantMapper;

    private Tenant testTenant;
    private Project testProject;

    @BeforeEach
    void setUp() {
        // 创建测试租户
        testTenant = new Tenant();
        testTenant.setId(UUID.randomUUID());
        testTenant.setName("Test Tenant");
        testTenant.setStatus(Tenant.Status.ACTIVE);
        testTenant.setCreatedAt(new Date());
        testTenant.setUpdatedAt(new Date());
        tenantMapper.insertTenant(testTenant);

        // 创建测试项目
        testProject = new Project();
        testProject.setTenantId(testTenant.getId());
        testProject.setName("Test Project");
        testProject.setDescription("Test Project Description");
        testProject.setStatus(Project.Status.ACTIVE);
        testProject.setCreatedAt(new Date());
        testProject.setUpdatedAt(new Date());
    }

    @Test
    void createProject_ShouldCreateAndReturnProject() {
        Project createdProject = projectService.createProject(testProject);

        assertNotNull(createdProject.getId());
        assertEquals(testProject.getName(), createdProject.getName());
        assertEquals(testProject.getTenantId(), createdProject.getTenantId());
        assertEquals(Project.Status.ACTIVE, createdProject.getStatus());
        
        // 验证数据库中的数据
        Project savedProject = projectMapper.findProjectById(createdProject.getId());
        assertNotNull(savedProject);
        assertEquals(createdProject.getName(), savedProject.getName());
    }

    @Test
    void getProjectById_ShouldReturnProject() {
        testProject.setId(UUID.randomUUID());
        projectMapper.insertProject(testProject);
        
        Project retrievedProject = projectService.getProjectById(testProject.getId());

        assertNotNull(retrievedProject);
        assertEquals(testProject.getId(), retrievedProject.getId());
        assertEquals(testProject.getName(), retrievedProject.getName());
    }

    @Test
    void getAllProjects_ShouldReturnAllProjects() {
        testProject.setId(UUID.randomUUID());
        projectMapper.insertProject(testProject);
        
        Project anotherProject = new Project();
        anotherProject.setId(UUID.randomUUID());
        anotherProject.setTenantId(testTenant.getId());
        anotherProject.setName("Another Project");
        anotherProject.setStatus(Project.Status.ACTIVE);
        anotherProject.setCreatedAt(new Date());
        anotherProject.setUpdatedAt(new Date());
        projectMapper.insertProject(anotherProject);

        List<Project> projects = projectService.getAllProjects();
        assertTrue(projects.size() >= 2);
    }

    @Test
    void getProjectsByTenantId_ShouldReturnProjectsForTenant() {
        testProject.setId(UUID.randomUUID());
        projectMapper.insertProject(testProject);
        
        List<Project> projects = projectService.getProjectsByTenantId(testTenant.getId());
        assertFalse(projects.isEmpty());
        assertEquals(testTenant.getId(), projects.get(0).getTenantId());
    }

    @Test
    void updateProject_ShouldUpdateAndReturnProject() {
        testProject.setId(UUID.randomUUID());
        projectMapper.insertProject(testProject);
        
        testProject.setName("Updated Project");
        testProject.setDescription("Updated Description");
        
        Project updatedProject = projectService.updateProject(testProject);
        
        assertEquals("Updated Project", updatedProject.getName());
        assertEquals("Updated Description", updatedProject.getDescription());
        
        // 验证数据库中的数据
        Project savedProject = projectMapper.findProjectById(testProject.getId());
        assertEquals("Updated Project", savedProject.getName());
        assertEquals("Updated Description", savedProject.getDescription());
    }

    @Test
    void deleteProject_ShouldSetStatusToDeleted() {
        testProject.setId(UUID.randomUUID());
        projectMapper.insertProject(testProject);
        
        projectService.deleteProject(testProject.getId());
        
        Project deletedProject = projectMapper.findProjectById(testProject.getId());
        assertNotNull(deletedProject);
        assertEquals(Project.Status.DELETED, deletedProject.getStatus());
    }

    @Test
    void createProject_WithInactiveTenant_ShouldThrowException() {
        testTenant.setStatus(Tenant.Status.INACTIVE);
        tenantMapper.updateTenant(testTenant);
        
        assertThrows(IllegalStateException.class, () -> {
            projectService.createProject(testProject);
        });
    }
}
