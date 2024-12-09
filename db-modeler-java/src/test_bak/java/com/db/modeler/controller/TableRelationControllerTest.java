package com.db.modeler.controller;

import com.db.modeler.entity.TableRelation;
import com.db.modeler.service.TableRelationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TableRelationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TableRelationService tableRelationService;

    @Autowired
    private ObjectMapper objectMapper;

    private TableRelation testRelation;
    private UUID projectId;
    private UUID sourceTableId;
    private UUID targetTableId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        sourceTableId = UUID.randomUUID();
        targetTableId = UUID.randomUUID();

        testRelation = new TableRelation();
        testRelation.setId(UUID.randomUUID());
        testRelation.setProjectId(projectId);
        testRelation.setSourceTableId(sourceTableId);
        testRelation.setTargetTableId(targetTableId);
        testRelation.setRelationType(TableRelation.RelationType.ONE_TO_MANY);

        List<TableRelation.ColumnMapping> columnMappings = new ArrayList<>();
        columnMappings.add(new TableRelation.ColumnMapping(
            "id", "source_id", TableRelation.ColumnMapping.MappingType.PRIMARY_KEY
        ));
        testRelation.setColumnMappings(columnMappings);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTableRelation_Success() throws Exception {
        when(tableRelationService.createTableRelation(any(TableRelation.class)))
            .thenReturn(testRelation);

        mockMvc.perform(post("/api/table-relations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRelation)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testRelation.getId().toString()))
                .andExpect(jsonPath("$.sourceTableId").value(sourceTableId.toString()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTableRelation_Success() throws Exception {
        when(tableRelationService.getTableRelationById(testRelation.getId()))
            .thenReturn(testRelation);

        mockMvc.perform(get("/api/table-relations/{id}", testRelation.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testRelation.getId().toString()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTableRelationsByProject_Success() throws Exception {
        List<TableRelation> relations = Collections.singletonList(testRelation);
        when(tableRelationService.getTableRelationsByProjectId(projectId))
            .thenReturn(relations);

        mockMvc.perform(get("/api/table-relations/project/{projectId}", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testRelation.getId().toString()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateTableRelation_Success() throws Exception {
        when(tableRelationService.updateTableRelation(any(TableRelation.class)))
            .thenReturn(testRelation);

        mockMvc.perform(put("/api/table-relations/{id}", testRelation.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRelation)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testRelation.getId().toString()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteTableRelation_Success() throws Exception {
        doNothing().when(tableRelationService).deleteTableRelation(testRelation.getId());

        mockMvc.perform(delete("/api/table-relations/{id}", testRelation.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void validateTableRelation_Success() throws Exception {
        when(tableRelationService.validateTableRelation(any(TableRelation.class)))
            .thenReturn(true);

        mockMvc.perform(post("/api/table-relations/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRelation)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void checkCircularDependency_Success() throws Exception {
        when(tableRelationService.checkCircularDependency(any(), any(TableRelation.class)))
            .thenReturn(false);

        mockMvc.perform(post("/api/table-relations/check-circular")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRelation)))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getRelationsBetweenTables_Success() throws Exception {
        List<TableRelation> relations = Collections.singletonList(testRelation);
        when(tableRelationService.getRelationsBetweenTables(sourceTableId, targetTableId))
            .thenReturn(relations);

        mockMvc.perform(get("/api/table-relations/between")
                .param("table1Id", sourceTableId.toString())
                .param("table2Id", targetTableId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testRelation.getId().toString()));
    }
}
