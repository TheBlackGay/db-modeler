package com.clb.template.controller;

import com.clb.template.TestApplication;
import com.clb.template.config.TestConfig;
import com.clb.template.entity.Tag;
import com.clb.template.repository.TagRepository;
import com.clb.template.service.TagService;
import com.clb.template.repository.FieldTemplateMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TagController.class)
@Import({TestConfig.class, TestApplication.class})
@ActiveProfiles("test")
class TagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TagService tagService;

    @MockBean
    private TagRepository tagRepository;
    
    @MockBean
    private FieldTemplateMapper fieldTemplateMapper;

    private List<Tag> testTags;
    private Tag testTag;
    private Map<String, Long> tagUsageCounts;

    @BeforeEach
    void setUp() {
        testTag = new Tag();
        testTag.setId("1");
        testTag.setName("Test Tag");
        testTag.setCreatedAt(LocalDateTime.now());
        testTag.setUpdatedAt(LocalDateTime.now());

        testTags = Arrays.asList(testTag);

        tagUsageCounts = new HashMap<>();
        tagUsageCounts.put("Test Tag", 5L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllTags() throws Exception {
        when(tagService.getAllTags()).thenReturn(testTags);

        mockMvc.perform(get("/api/tags")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testTag.getId()))
                .andExpect(jsonPath("$[0].name").value(testTag.getName()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTagUsageCounts() throws Exception {
        when(tagService.getTagUsageCounts()).thenReturn(tagUsageCounts);

        mockMvc.perform(get("/api/tags/usage")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.['Test Tag']").value(5));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTemplateTagsById() throws Exception {
        String templateId = "template1";
        when(tagService.getTemplateTagsById(templateId)).thenReturn(testTags);

        mockMvc.perform(get("/api/tags/template/{templateId}", templateId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testTag.getId()))
                .andExpect(jsonPath("$[0].name").value(testTag.getName()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTag() throws Exception {
        when(tagService.createTag(any(Tag.class))).thenReturn(testTag);

        mockMvc.perform(post("/api/tags")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(testTag)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testTag.getId()))
                .andExpect(jsonPath("$.name").value(testTag.getName()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteTag() throws Exception {
        String tagId = "1";
        doNothing().when(tagService).deleteTag(tagId);

        mockMvc.perform(delete("/api/tags/{id}", tagId))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void mergeTags() throws Exception {
        List<String> sourceTagIds = Arrays.asList("1", "2");
        Tag newTag = new Tag();
        newTag.setName("Merged Tag");

        doNothing().when(tagService).mergeTags(sourceTagIds, newTag);

        mockMvc.perform(post("/api/tags/merge")
                .param("sourceTagIds", sourceTagIds.toArray(new String[0]))
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(newTag)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void unauthorizedAccess() throws Exception {
        mockMvc.perform(get("/api/tags"))
                .andExpect(status().isForbidden());
    }
}
