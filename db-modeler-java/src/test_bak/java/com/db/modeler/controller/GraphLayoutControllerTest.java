package com.db.modeler.controller;

import com.db.modeler.entity.GraphLayout;
import com.db.modeler.service.GraphLayoutService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(GraphLayoutController.class)
class GraphLayoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GraphLayoutService graphLayoutService;

    @Autowired
    private ObjectMapper objectMapper;

    private GraphLayout testLayout;
    private String projectId;
    private String layoutId;
    private String layoutData;

    @BeforeEach
    void setUp() {
        projectId = "test-project";
        layoutId = "test-layout";
        layoutData = "{\"nodes\":[{\"id\":\"1\",\"x\":100,\"y\":100}]}";

        testLayout = new GraphLayout();
        testLayout.setId(layoutId);
        testLayout.setProjectId(projectId);
        testLayout.setLayoutData(layoutData);
        testLayout.setCreatedAt(System.currentTimeMillis());
        testLayout.setUpdatedAt(System.currentTimeMillis());
    }

    @Test
    void getProjectLayout_Success() throws Exception {
        when(graphLayoutService.getProjectLayout(projectId))
                .thenReturn(Collections.singletonList(testLayout));

        mockMvc.perform(get("/api/graph-layouts/projects/{projectId}", projectId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(layoutId))
                .andExpect(jsonPath("$[0].projectId").value(projectId))
                .andExpect(jsonPath("$[0].layoutData").value(layoutData));
    }

    @Test
    void saveProjectLayout_Success() throws Exception {
        when(graphLayoutService.saveProjectLayout(eq(projectId), any(String.class)))
                .thenReturn(testLayout);

        mockMvc.perform(post("/api/graph-layouts/projects/{projectId}", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(layoutData))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(layoutId))
                .andExpect(jsonPath("$.projectId").value(projectId))
                .andExpect(jsonPath("$.layoutData").value(layoutData));
    }

    @Test
    void updateProjectLayout_Success() throws Exception {
        when(graphLayoutService.updateProjectLayout(eq(layoutId), any(String.class)))
                .thenReturn(testLayout);

        mockMvc.perform(put("/api/graph-layouts/{layoutId}", layoutId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(layoutData))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(layoutId))
                .andExpect(jsonPath("$.projectId").value(projectId))
                .andExpect(jsonPath("$.layoutData").value(layoutData));
    }

    @Test
    void deleteProjectLayout_Success() throws Exception {
        mockMvc.perform(delete("/api/graph-layouts/projects/{projectId}", projectId))
                .andExpect(status().isOk());
    }
}
