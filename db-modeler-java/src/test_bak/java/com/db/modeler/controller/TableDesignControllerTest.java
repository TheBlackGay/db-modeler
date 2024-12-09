package com.db.modeler.controller;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.service.TableDesignService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.containsString;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TableDesignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TableDesignService tableDesignService;

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
        testTableDesign.setCreatedBy(UUID.randomUUID());
        testTableDesign.setType(TableDesign.Type.TABLE);
        testTableDesign.setDomain(TableDesign.Domain.BUSINESS);
        testTableDesign.setStatus(TableDesign.Status.DRAFT);
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void createTableDesign_ShouldReturnCreatedTableDesign() throws Exception {
        when(tableDesignService.createTableDesign(any(TableDesign.class))).thenReturn(testTableDesign);

        mockMvc.perform(post("/api/tables")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(tableId.toString()))
                .andExpect(jsonPath("$.code").value("TEST_TABLE"))
                .andExpect(jsonPath("$.displayName").value("Test Table"));
                
        verify(tableDesignService).createTableDesign(any(TableDesign.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getTableDesignById_ShouldReturnTableDesign() throws Exception {
        when(tableDesignService.getTableDesignById(tableId)).thenReturn(testTableDesign);

        mockMvc.perform(get("/api/tables/{id}", tableId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(tableId.toString()))
                .andExpect(jsonPath("$.code").value("TEST_TABLE"));
                
        verify(tableDesignService).getTableDesignById(tableId);
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getAllTableDesigns_ShouldReturnListOfTableDesigns() throws Exception {
        when(tableDesignService.getAllTableDesigns()).thenReturn(Arrays.asList(testTableDesign));

        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(tableId.toString()))
                .andExpect(jsonPath("$[0].code").value("TEST_TABLE"));
                
        verify(tableDesignService).getAllTableDesigns();
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getTableDesignByProjectIdAndCode_ShouldReturnTableDesign() throws Exception {
        when(tableDesignService.findByProjectIdAndCode(projectId, "TEST_TABLE")).thenReturn(testTableDesign);

        mockMvc.perform(get("/api/tables/project/{projectId}/code/{code}", projectId, "TEST_TABLE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(tableId.toString()))
                .andExpect(jsonPath("$.code").value("TEST_TABLE"));
                
        verify(tableDesignService).findByProjectIdAndCode(projectId, "TEST_TABLE");
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void updateTableDesign_ShouldReturnUpdatedTableDesign() throws Exception {
        when(tableDesignService.updateTableDesign(any(TableDesign.class))).thenReturn(testTableDesign);

        mockMvc.perform(put("/api/tables/{id}", tableId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(tableId.toString()))
                .andExpect(jsonPath("$.code").value("TEST_TABLE"));
                
        verify(tableDesignService).updateTableDesign(any(TableDesign.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void deleteTableDesign_ShouldReturnNoContent() throws Exception {
        doNothing().when(tableDesignService).deleteTableDesign(tableId);

        mockMvc.perform(delete("/api/tables/{id}", tableId))
                .andExpect(status().isNoContent());
                
        verify(tableDesignService).deleteTableDesign(tableId);
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void accessDenied_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isForbidden())
                .andExpect(content().string(containsString("Access denied")));
    }

    @Test
    void unauthorized_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(containsString("Authentication failed")));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getTableDesign_WithInvalidId_ShouldReturnNotFound() throws Exception {
        UUID invalidId = UUID.randomUUID();
        when(tableDesignService.getTableDesignById(invalidId)).thenReturn(null);

        mockMvc.perform(get("/api/tables/{id}", invalidId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void createTableDesign_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        testTableDesign.setCode(null); // Invalid data: code is required

        mockMvc.perform(post("/api/tables")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isBadRequest());
    }
}
