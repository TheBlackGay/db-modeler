package com.db.modeler.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SessionManagementTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    void session_ShouldBeCreatedAfterLogin() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) result.getRequest().getSession();
        assertNotNull(session);
        assertNotNull(session.getId());
    }

    @Test
    @WithMockUser
    void session_ShouldPersistAcrossRequests() throws Exception {
        // 第一个请求
        MvcResult firstResult = mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) firstResult.getRequest().getSession();

        // 使用相同的session进行第二个请求
        mockMvc.perform(get("/api/user/profile")
                .session(session))
                .andExpect(status().isOk());

        assertNotNull(session.getId());
    }

    @Test
    @WithMockUser
    void session_ShouldExpireAfterTimeout() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) result.getRequest().getSession();
        
        // 模拟session超时
        session.setMaxInactiveInterval(1); // 1秒后超时
        Thread.sleep(2000); // 等待2秒

        mockMvc.perform(get("/api/user/profile")
                .session(session))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void session_ShouldBeInvalidatedAfterLogout() throws Exception {
        // 创建会话
        MvcResult result = mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) result.getRequest().getSession();

        // 执行登出
        mockMvc.perform(post("/api/auth/logout")
                .session(session))
                .andExpect(status().isOk());

        // 验证会话已失效
        assertTrue(session.isInvalid());
    }

    @Test
    void concurrentSessions_ShouldBeHandled() throws Exception {
        // 第一个会话登录
        MvcResult firstLogin = mockMvc.perform(post("/api/auth/login")
                .content("{\"username\":\"admin\",\"password\":\"admin123\"}")
                .contentType("application/json"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession firstSession = (MockHttpSession) firstLogin.getRequest().getSession();

        // 第二个会话登录（应该使第一个会话失效）
        MvcResult secondLogin = mockMvc.perform(post("/api/auth/login")
                .content("{\"username\":\"admin\",\"password\":\"admin123\"}")
                .contentType("application/json"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession secondSession = (MockHttpSession) secondLogin.getRequest().getSession();

        // 使用第一个会话尝试访问（应该失败）
        mockMvc.perform(get("/api/user/profile")
                .session(firstSession))
                .andExpect(status().isUnauthorized());

        // 使用第二个会话访问（应该成功）
        mockMvc.perform(get("/api/user/profile")
                .session(secondSession))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void sessionAttributes_ShouldBeMaintained() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) result.getRequest().getSession();
        
        // 验证session中包含了必要的安全属性
        assertNotNull(session.getAttribute("SPRING_SECURITY_CONTEXT"));
    }
}
