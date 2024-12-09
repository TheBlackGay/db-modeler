package com.db.modeler.security;

import com.db.modeler.entity.TableDesign;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CsrfProtectionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private TableDesign testTableDesign;
    private UUID tableId;
    private UUID projectId;

    @BeforeEach
    void setUp() {
        tableId = UUID.randomUUID();
        projectId = UUID.randomUUID();
        
        testTableDesign = new TableDesign();
        testTableDesign.setId(tableId);
        testTableDesign.setProjectId(projectId);
        testTableDesign.setCode("TEST_TABLE");
        testTableDesign.setDisplayName("Test Table");
        testTableDesign.setComment("Test Table Description");
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void postRequest_WithoutCsrf_ShouldBeForbidden() throws Exception {
        mockMvc.perform(post("/api/tables")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void postRequest_WithCsrf_ShouldBeAllowed() throws Exception {
        mockMvc.perform(post("/api/tables")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void putRequest_WithoutCsrf_ShouldBeForbidden() throws Exception {
        mockMvc.perform(put("/api/tables/{id}", tableId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void putRequest_WithCsrf_ShouldBeAllowed() throws Exception {
        mockMvc.perform(put("/api/tables/{id}", tableId)
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void deleteRequest_WithoutCsrf_ShouldBeForbidden() throws Exception {
        mockMvc.perform(delete("/api/tables/{id}", tableId))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void deleteRequest_WithCsrf_ShouldBeAllowed() throws Exception {
        mockMvc.perform(delete("/api/tables/{id}", tableId)
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getRequest_WithoutCsrf_ShouldBeAllowed() throws Exception {
        mockMvc.perform(get("/api/tables/{id}", tableId))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void invalidCsrfToken_ShouldBeForbidden() throws Exception {
        mockMvc.perform(post("/api/tables")
                .header("X-CSRF-TOKEN", "invalid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void multipleRequests_WithSameCsrfToken_ShouldBeAllowed() throws Exception {
        // First request
        mockMvc.perform(post("/api/tables")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk());

        // Second request with same token
        mockMvc.perform(put("/api/tables/{id}", tableId)
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk());
    }
}
