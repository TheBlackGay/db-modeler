package com.db.modeler.controller;

import com.db.modeler.entity.Project;
import com.db.modeler.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.hamcrest.Matchers;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    private Project testProject;
    private UUID projectId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        testProject = new Project();
        testProject.setId(projectId);
        testProject.setName("Test Project");
        testProject.setDescription("Test Description");
        testProject.setCreatedAt(System.currentTimeMillis());
        testProject.setUpdatedAt(System.currentTimeMillis());
    }

    @Test
    void createProject_Success() throws Exception {
        when(projectService.createProject(any(Project.class)))
                .thenReturn(testProject);

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProject)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.name").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    void getProject_Success() throws Exception {
        when(projectService.getProjectById(projectId))
                .thenReturn(testProject);

        mockMvc.perform(get("/api/projects/{id}", projectId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.name").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    void getAllProjects_Success() throws Exception {
        when(projectService.getAllProjects())
                .thenReturn(Arrays.asList(testProject));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(projectId.toString()))
                .andExpect(jsonPath("$[0].name").value("Test Project"))
                .andExpect(jsonPath("$[0].description").value("Test Description"));
    }

    @Test
    void updateProject_Success() throws Exception {
        Project updatedProject = new Project();
        updatedProject.setId(projectId);
        updatedProject.setName("Updated Project");
        updatedProject.setDescription("Updated Description");

        when(projectService.updateProject(any(Project.class)))
                .thenReturn(updatedProject);

        mockMvc.perform(put("/api/projects/{id}", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedProject)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.name").value("Updated Project"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    void deleteProject_Success() throws Exception {
        mockMvc.perform(delete("/api/projects/{id}", projectId))
                .andExpect(status().isOk());
    }

    @Test
    void createProject_InvalidInput() throws Exception {
        Project invalidProject = new Project();
        // Missing required fields

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidProject)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", Matchers.containsString("Invalid input")));
    }

    @Test
    void updateProject_InvalidInput() throws Exception {
        Project invalidProject = new Project();
        // Missing required fields

        mockMvc.perform(put("/api/projects/{id}", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidProject)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", Matchers.containsString("Invalid input")));
    }
}
