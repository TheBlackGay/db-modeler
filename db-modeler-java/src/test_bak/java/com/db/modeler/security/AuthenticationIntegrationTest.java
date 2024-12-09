package com.db.modeler.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_WithValidCredentials_ShouldSucceed() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("JSESSIONID"))
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        // 验证返回的token格式
        String response = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(response, AuthResponse.class);
        assertNotNull(authResponse.getToken());
        assertTrue(authResponse.getToken().length() > 0);
    }

    @Test
    void login_WithInvalidCredentials_ShouldFail() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(cookie().doesNotExist("JSESSIONID"))
                .andExpect(jsonPath("$.error").value("Invalid credentials"));
    }

    @Test
    void login_WithNonexistentUser_ShouldFail() throws Exception {
        LoginRequest loginRequest = new LoginRequest("nonexistent", "password");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("User not found"));
    }

    @Test
    void logout_ShouldInvalidateSession() throws Exception {
        // 先登录
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String sessionId = loginResult.getResponse().getCookie("JSESSIONID").getValue();

        // 执行登出
        mockMvc.perform(post("/api/auth/logout")
                .cookie(loginResult.getResponse().getCookies()))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("JSESSIONID", 0));
    }

    @Test
    void refreshToken_WithValidToken_ShouldSucceed() throws Exception {
        // 先登录获取token
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String response = loginResult.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(response, AuthResponse.class);
        String token = authResponse.getToken();

        // 刷新token
        mockMvc.perform(post("/api/auth/refresh")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isString());
    }

    @Test
    void refreshToken_WithInvalidToken_ShouldFail() throws Exception {
        mockMvc.perform(post("/api/auth/refresh")
                .header("Authorization", "Bearer invalid_token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid token"));
    }
}

class LoginRequest {
    private String username;
    private String password;

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}

class AuthResponse {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
