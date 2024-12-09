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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RateLimitTest {

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
    void singleUser_ShouldBeRateLimited() throws Exception {
        // Make requests up to the limit
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(get("/api/tables"))
                    .andExpect(status().isOk());
        }

        // The next request should be rate limited
        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("X-RateLimit-Remaining"))
                .andExpect(header().exists("X-RateLimit-Reset"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void concurrentRequests_ShouldBeRateLimited() throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(5);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger limitedCount = new AtomicInteger(0);

        // Submit 20 concurrent requests
        for (int i = 0; i < 20; i++) {
            executor.submit(() -> {
                try {
                    MvcResult result = mockMvc.perform(get("/api/tables"))
                            .andReturn();
                    if (result.getResponse().getStatus() == 200) {
                        successCount.incrementAndGet();
                    } else if (result.getResponse().getStatus() == 429) {
                        limitedCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    fail("Exception during concurrent requests: " + e.getMessage());
                }
            });
        }

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        assertTrue(successCount.get() <= 10, "Should not allow more than 10 successful requests");
        assertTrue(limitedCount.get() > 0, "Some requests should be rate limited");
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void differentEndpoints_ShouldHaveSeparateLimits() throws Exception {
        // Make requests to first endpoint
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(get("/api/tables"))
                    .andExpect(status().isOk());
        }
        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isTooManyRequests());

        // Should still be able to access different endpoint
        mockMvc.perform(get("/api/tables/{id}", tableId))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void rateLimitHeaders_ShouldBePresent() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/tables"))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-RateLimit-Limit"))
                .andExpect(header().exists("X-RateLimit-Remaining"))
                .andExpect(header().exists("X-RateLimit-Reset"))
                .andReturn();

        String remainingHeader = result.getResponse().getHeader("X-RateLimit-Remaining");
        assertNotNull(remainingHeader);
        assertTrue(Integer.parseInt(remainingHeader) < 10);
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void burstRequests_ShouldBeRateLimited() throws Exception {
        // Send burst of requests
        for (int i = 0; i < 20; i++) {
            MvcResult result = mockMvc.perform(get("/api/tables"))
                    .andReturn();

            if (i < 10) {
                assertEquals(200, result.getResponse().getStatus());
            } else {
                assertEquals(429, result.getResponse().getStatus());
            }
        }
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void multipleUsers_ShouldHaveSeparateLimits() throws Exception {
        // First user
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(get("/api/tables")
                    .with(request -> {
                        request.setRemoteAddr("192.168.1.1");
                        return request;
                    }))
                    .andExpect(status().isOk());
        }
        mockMvc.perform(get("/api/tables")
                .with(request -> {
                    request.setRemoteAddr("192.168.1.1");
                    return request;
                }))
                .andExpect(status().isTooManyRequests());

        // Second user should still be able to make requests
        mockMvc.perform(get("/api/tables")
                .with(request -> {
                    request.setRemoteAddr("192.168.1.2");
                    return request;
                }))
                .andExpect(status().isOk());
    }
}
