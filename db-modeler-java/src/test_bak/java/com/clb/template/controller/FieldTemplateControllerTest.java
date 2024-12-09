package com.clb.template.controller;

import com.clb.template.TestApplication;
import com.clb.template.config.TestConfig;
import com.clb.template.dto.FieldTemplateDTO;
import com.clb.template.service.FieldTemplateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = FieldTemplateController.class)
@Import({TestConfig.class, TestApplication.class})
@ActiveProfiles("test")
class FieldTemplateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FieldTemplateService fieldTemplateService;

    @Autowired
    private ObjectMapper objectMapper;

    private FieldTemplateDTO testTemplate;
    private List<FieldTemplateDTO> testTemplates;

    @BeforeEach
    void setUp() {
        testTemplate = new FieldTemplateDTO();
        testTemplate.setId("1");
        testTemplate.setName("Test Template");
        testTemplate.setDescription("Test Description");
        testTemplate.setType("string");
        testTemplate.setDefaultValue("default");
        testTemplate.setRequired(true);
        testTemplate.setUnique(false);
        testTemplate.setMinLength(1);
        testTemplate.setMaxLength(255);
        testTemplate.setPattern(".*");
        testTemplate.setCreatedAt(LocalDateTime.now());
        testTemplate.setUpdatedAt(LocalDateTime.now());

        FieldTemplateDTO template2 = new FieldTemplateDTO();
        template2.setId("2");
        template2.setName("Test Template 2");
        template2.setDescription("Test Description 2");
        template2.setType("number");
        template2.setDefaultValue("0");
        template2.setRequired(false);
        template2.setUnique(true);
        template2.setCreatedAt(LocalDateTime.now());
        template2.setUpdatedAt(LocalDateTime.now());

        testTemplates = Arrays.asList(testTemplate, template2);
    }

    @Test
    void getAllTemplates() throws Exception {
        when(fieldTemplateService.findAll()).thenReturn(testTemplates);

        mockMvc.perform(get("/api/field-templates"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("Test Template"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].name").value("Test Template 2"));

        verify(fieldTemplateService).findAll();
    }

    @Test
    void getTemplateById() throws Exception {
        when(fieldTemplateService.findById("1")).thenReturn(testTemplate);

        mockMvc.perform(get("/api/field-templates/{id}", "1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Test Template"))
                .andExpect(jsonPath("$.type").value("string"));

        verify(fieldTemplateService).findById("1");
    }

    @Test
    void createTemplate() throws Exception {
        when(fieldTemplateService.create(any(FieldTemplateDTO.class))).thenReturn(testTemplate);

        mockMvc.perform(post("/api/field-templates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTemplate)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Test Template"));

        verify(fieldTemplateService).create(any(FieldTemplateDTO.class));
    }

    @Test
    void updateTemplate() throws Exception {
        when(fieldTemplateService.update(eq("1"), any(FieldTemplateDTO.class))).thenReturn(testTemplate);

        mockMvc.perform(put("/api/field-templates/{id}", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTemplate)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Test Template"));

        verify(fieldTemplateService).update(eq("1"), any(FieldTemplateDTO.class));
    }

    @Test
    void deleteTemplate() throws Exception {
        doNothing().when(fieldTemplateService).delete("1");

        mockMvc.perform(delete("/api/field-templates/{id}", "1"))
                .andExpect(status().isOk());

        verify(fieldTemplateService).delete("1");
    }

    @Test
    void addTag() throws Exception {
        String templateId = "1";
        String tagId = "tag1";
        doNothing().when(fieldTemplateService).addTag(templateId, tagId);

        mockMvc.perform(post("/api/field-templates/{templateId}/tags/{tagId}", templateId, tagId))
                .andExpect(status().isOk());

        verify(fieldTemplateService).addTag(templateId, tagId);
    }

    @Test
    void removeTag() throws Exception {
        String templateId = "1";
        String tagId = "tag1";
        doNothing().when(fieldTemplateService).removeTag(templateId, tagId);

        mockMvc.perform(delete("/api/field-templates/{templateId}/tags/{tagId}", templateId, tagId))
                .andExpect(status().isOk());

        verify(fieldTemplateService).removeTag(templateId, tagId);
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void unauthorizedAccess() throws Exception {
        mockMvc.perform(get("/api/field-templates"))
                .andExpect(status().isForbidden())
                .andExpect(content().string(Matchers.containsString("Access denied")));
    }

    @Test
    void unauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/field-templates"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(Matchers.containsString("Authentication failed")));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void adminAccess() throws Exception {
        when(fieldTemplateService.findAll()).thenReturn(testTemplates);

        mockMvc.perform(get("/api/field-templates"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("1"));
    }
}
