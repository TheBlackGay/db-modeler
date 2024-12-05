package com.db.modeler.controller;

import com.db.modeler.entity.Project;
import com.db.modeler.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    private Project testProject;
    private UUID projectId;
    private UUID tenantId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        tenantId = UUID.randomUUID();
        
        testProject = new Project();
        testProject.setId(projectId);
        testProject.setTenantId(tenantId);
        testProject.setName("Test Project");
        testProject.setDescription("Test Project Description");
        testProject.setStatus(Project.Status.ACTIVE);
        testProject.setCreatedAt(new Date());
        testProject.setUpdatedAt(new Date());
    }

    @Test
    @WithMockUser
    void createProject_ShouldReturnCreatedProject() throws Exception {
        when(projectService.createProject(any(Project.class))).thenReturn(testProject);

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProject)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.name").value("Test Project"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
                
        verify(projectService).createProject(any(Project.class));
    }

    @Test
    @WithMockUser
    void getProjectById_ShouldReturnProject() throws Exception {
        when(projectService.getProjectById(projectId)).thenReturn(testProject);

        mockMvc.perform(get("/api/projects/{id}", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.name").value("Test Project"));
                
        verify(projectService).getProjectById(projectId);
    }

    @Test
    @WithMockUser
    void getAllProjects_ShouldReturnListOfProjects() throws Exception {
        when(projectService.getAllProjects()).thenReturn(Arrays.asList(testProject));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(projectId.toString()))
                .andExpect(jsonPath("$[0].name").value("Test Project"));
                
        verify(projectService).getAllProjects();
    }

    @Test
    @WithMockUser
    void getProjectsByTenantId_ShouldReturnListOfProjects() throws Exception {
        when(projectService.getProjectsByTenantId(tenantId)).thenReturn(Arrays.asList(testProject));

        mockMvc.perform(get("/api/projects")
                .param("tenantId", tenantId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(projectId.toString()))
                .andExpect(jsonPath("$[0].name").value("Test Project"));
                
        verify(projectService).getProjectsByTenantId(tenantId);
    }

    @Test
    @WithMockUser
    void updateProject_ShouldReturnUpdatedProject() throws Exception {
        when(projectService.updateProject(any(Project.class))).thenReturn(testProject);

        mockMvc.perform(put("/api/projects/{id}", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProject)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Project"));
                
        verify(projectService).updateProject(any(Project.class));
    }

    @Test
    @WithMockUser
    void deleteProject_ShouldReturnNoContent() throws Exception {
        doNothing().when(projectService).deleteProject(projectId);

        mockMvc.perform(delete("/api/projects/{id}", projectId))
                .andExpect(status().isNoContent());
                
        verify(projectService).deleteProject(projectId);
    }
}
