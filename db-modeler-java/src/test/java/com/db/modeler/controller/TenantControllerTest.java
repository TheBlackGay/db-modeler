package com.db.modeler.controller;

import com.db.modeler.entity.Tenant;
import com.db.modeler.service.TenantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TenantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TenantService tenantService;

    @Autowired
    private ObjectMapper objectMapper;

    private Tenant testTenant;

    @BeforeEach
    void setUp() {
        testTenant = new Tenant();
        testTenant.setId(UUID.randomUUID());
        testTenant.setName("Test Tenant");
        testTenant.setCode("TEST001");
        testTenant.setStatus(Tenant.Status.ACTIVE);
    }

    @Test
    void createTenant_ShouldReturnCreatedTenant() throws Exception {
        when(tenantService.createTenant(any(Tenant.class))).thenReturn(testTenant);

        mockMvc.perform(post("/api/tenants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTenant)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value(testTenant.getName()))
                .andExpect(jsonPath("$.code").value(testTenant.getCode()))
                .andExpect(jsonPath("$.status").value(testTenant.getStatus().toString()));
    }

    @Test
    void getTenant_ShouldReturnTenant() throws Exception {
        when(tenantService.getTenantById(testTenant.getId())).thenReturn(testTenant);

        mockMvc.perform(get("/api/tenants/{id}", testTenant.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testTenant.getId().toString()))
                .andExpect(jsonPath("$.name").value(testTenant.getName()))
                .andExpect(jsonPath("$.code").value(testTenant.getCode()));
    }

    @Test
    void getAllTenants_ShouldReturnList() throws Exception {
        when(tenantService.getAllTenants()).thenReturn(Arrays.asList(testTenant));

        mockMvc.perform(get("/api/tenants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testTenant.getId().toString()))
                .andExpect(jsonPath("$[0].name").value(testTenant.getName()))
                .andExpect(jsonPath("$[0].code").value(testTenant.getCode()));
    }

    @Test
    void updateTenant_ShouldReturnUpdatedTenant() throws Exception {
        when(tenantService.updateTenant(any(Tenant.class))).thenReturn(testTenant);

        mockMvc.perform(put("/api/tenants/{id}", testTenant.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTenant)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testTenant.getId().toString()))
                .andExpect(jsonPath("$.name").value(testTenant.getName()))
                .andExpect(jsonPath("$.code").value(testTenant.getCode()));
    }

    @Test
    void deleteTenant_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/tenants/{id}", testTenant.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    void createTenant_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        Tenant invalidTenant = new Tenant();
        // Not setting required fields

        mockMvc.perform(post("/api/tenants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidTenant)))
                .andExpect(status().isBadRequest());
    }
}
