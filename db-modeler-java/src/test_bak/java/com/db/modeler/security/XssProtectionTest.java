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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class XssProtectionTest {

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
        testTableDesign.setCode("<script>alert('xss')</script>");
        testTableDesign.setDisplayName("<img src=x onerror=alert('xss')>");
        testTableDesign.setComment("<a href='javascript:alert(\"xss\")'>click me</a>");
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void createTableDesign_ShouldEscapeXssInJson() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/tables")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk())
                .andExpect(content().string(not(containsString("<script>"))))
                .andExpect(content().string(not(containsString("javascript:"))))
                .andExpect(content().string(not(containsString("onerror="))))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("&lt;script&gt;"));
        assertTrue(response.contains("&lt;img"));
        assertTrue(response.contains("&lt;a href="));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getTableDesign_ShouldEscapeXssInResponse() throws Exception {
        mockMvc.perform(get("/api/tables/{id}", tableId))
                .andExpect(status().isOk())
                .andExpect(content().string(not(containsString("<script>"))))
                .andExpect(content().string(not(containsString("javascript:"))))
                .andExpect(content().string(not(containsString("onerror="))));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void updateTableDesign_ShouldEscapeXssInJson() throws Exception {
        testTableDesign.setDisplayName("<svg onload=alert(1)>");
        
        MvcResult result = mockMvc.perform(put("/api/tables/{id}", tableId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk())
                .andExpect(content().string(not(containsString("<svg"))))
                .andExpect(content().string(not(containsString("onload="))))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("&lt;svg"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void searchTableDesigns_ShouldEscapeXssInSearchParams() throws Exception {
        String xssSearchTerm = "<script>alert('xss')</script>";
        
        mockMvc.perform(get("/api/tables/search")
                .param("query", xssSearchTerm))
                .andExpect(status().isOk())
                .andExpect(content().string(not(containsString("<script>"))));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void complexXssPayload_ShouldBeEscaped() throws Exception {
        testTableDesign.setDisplayName("\">'><script>alert(document.cookie)</script>");
        testTableDesign.setComment("<img src=\"x\" onerror=\"&#x61;&#x6C;&#x65;&#x72;&#x74;&#x28;&#x27;&#x58;&#x53;&#x53;&#x27;&#x29;\"/>");
        
        MvcResult result = mockMvc.perform(post("/api/tables")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTableDesign)))
                .andExpect(status().isOk())
                .andExpect(content().string(not(containsString("<script>"))))
                .andExpect(content().string(not(containsString("onerror="))))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("&quot;&gt;&#x27;&gt;"));
        assertTrue(response.contains("&lt;img"));
    }
}
