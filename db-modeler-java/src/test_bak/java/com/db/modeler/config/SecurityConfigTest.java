package com.db.modeler.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    // Test public endpoints
    @Test
    @WithAnonymousUser
    void publicEndpoints_ShouldBeAccessibleToAll() throws Exception {
        mockMvc.perform(get("/")).andExpect(status().isOk());
        mockMvc.perform(get("/error")).andExpect(status().isOk());
        mockMvc.perform(get("/favicon.ico")).andExpect(status().isOk());
    }

    // Test admin endpoints with admin role
    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void adminEndpoints_WithAdminRole_ShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/api/admin/users")).andExpect(status().isOk());
        mockMvc.perform(get("/api/admin/settings")).andExpect(status().isOk());
    }

    // Test admin endpoints with user role
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void adminEndpoints_WithUserRole_ShouldBeDenied() throws Exception {
        mockMvc.perform(get("/api/admin/users")).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/settings")).andExpect(status().isForbidden());
    }

    // Test user endpoints with admin role
    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void userEndpoints_WithAdminRole_ShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/api/user/profile")).andExpect(status().isOk());
        mockMvc.perform(get("/api/user/preferences")).andExpect(status().isOk());
    }

    // Test user endpoints with user role
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void userEndpoints_WithUserRole_ShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/api/user/profile")).andExpect(status().isOk());
        mockMvc.perform(get("/api/user/preferences")).andExpect(status().isOk());
    }

    // Test protected endpoints with no authentication
    @Test
    @WithAnonymousUser
    void protectedEndpoints_WithNoAuth_ShouldBeUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/users")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/user/profile")).andExpect(status().isUnauthorized());
    }

    // Test API endpoints with admin role
    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void apiEndpoints_WithAdminRole_ShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/api/projects")).andExpect(status().isOk());
        mockMvc.perform(get("/api/tables")).andExpect(status().isOk());
    }

    // Test API endpoints with user role
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void apiEndpoints_WithUserRole_ShouldBeDenied() throws Exception {
        mockMvc.perform(get("/api/projects")).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/tables")).andExpect(status().isForbidden());
    }

    // Test OPTIONS requests for CORS
    @Test
    @WithAnonymousUser
    void optionsRequest_ShouldBeAllowed() throws Exception {
        mockMvc.perform(get("/api/projects").header("Access-Control-Request-Method", "GET")
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk());
    }

    // Test actuator endpoints
    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void actuatorEndpoints_WithAdminRole_ShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/actuator/health")).andExpect(status().isOk());
        mockMvc.perform(get("/actuator/info")).andExpect(status().isOk());
    }

    @Test
    @WithAnonymousUser
    void actuatorEndpoints_WithNoAuth_ShouldBeDenied() throws Exception {
        mockMvc.perform(get("/actuator/health")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/actuator/info")).andExpect(status().isUnauthorized());
    }
}
