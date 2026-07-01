package com.insurewell.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurewell.dto.LoginRequest;
import com.insurewell.model.User;
import com.insurewell.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    userRepository.deleteAll();
    userRepository.save(User.builder()
      .username("testuser")
      .password(passwordEncoder.encode("password123"))
      .role("USER")
      .build());
    userRepository.save(User.builder()
      .username("testadmin")
      .password(passwordEncoder.encode("adminpass"))
      .role("ADMIN")
      .build());
  }

  @Test
  void login_withValidCredentials_returnsToken() throws Exception {
    LoginRequest req = new LoginRequest();
    req.setUsername("testuser");
    req.setPassword("password123");

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.token", not(emptyString())))
      .andExpect(jsonPath("$.username", is("testuser")))
      .andExpect(jsonPath("$.role", is("USER")));
  }

  @Test
  void login_withWrongPassword_returns401() throws Exception {
    LoginRequest req = new LoginRequest();
    req.setUsername("testuser");
    req.setPassword("wrongpassword");

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
      .andExpect(status().isUnauthorized())
      .andExpect(jsonPath("$.error", not(emptyString())))
      .andExpect(jsonPath("$.error", not(containsString("wrongpassword"))));
  }

  @Test
  void login_withUnknownUser_returns401() throws Exception {
    LoginRequest req = new LoginRequest();
    req.setUsername("unknownuser");
    req.setPassword("anypassword");

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
      .andExpect(status().isUnauthorized())
      .andExpect(jsonPath("$.error", not(emptyString())));
  }

  @Test
  void login_withMissingFields_returns400() throws Exception {
    LoginRequest req = new LoginRequest();
    req.setUsername("");
    req.setPassword("");

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.error", not(emptyString())));
  }

  @Test
  void healthEndpoint_isPublic() throws Exception {
    mockMvc.perform(get("/api/health"))
      .andExpect(status().isOk());
  }

  @Test
  void protectedEndpoint_withoutToken_returns401() throws Exception {
    mockMvc.perform(get("/api/policies"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void protectedEndpoint_withValidToken_returns200() throws Exception {
    // First login to get token
    LoginRequest req = new LoginRequest();
    req.setUsername("testuser");
    req.setPassword("password123");

    String response = mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
      .andExpect(status().isOk())
      .andReturn().getResponse().getContentAsString();

    String token = objectMapper.readTree(response).get("token").asText();

    mockMvc.perform(get("/api/policies")
        .header("Authorization", "Bearer " + token))
      .andExpect(status().isOk());
  }

  @Test
  void login_errorMessage_doesNotLeakCredentials() throws Exception {
    LoginRequest req = new LoginRequest();
    req.setUsername("testuser");
    req.setPassword("secretpassword");

    String response = mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
      .andExpect(status().isUnauthorized())
      .andReturn().getResponse().getContentAsString();

    // Error message should not contain the attempted password
    org.junit.jupiter.api.Assertions.assertFalse(
      response.contains("secretpassword"),
      "Error response should not echo back the password"
    );
  }
}
