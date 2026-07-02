package com.insurewell.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurewell.config.SeedCredentials;
import com.insurewell.dto.LoginRequest;
import com.insurewell.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private UserRepository userRepository;

  @Test
  void seedsDefaultAdminUser() {
    assertThat(userRepository.existsByUsername("admin")).isTrue();
  }

  @Test
  void rejectsProtectedApisUntilUserSignsIn() throws Exception {
    mockMvc.perform(get("/api/policies"))
      .andExpect(status().isUnauthorized());

    mockMvc.perform(get("/api/auth/me"))
      .andExpect(status().isUnauthorized())
      .andExpect(jsonPath("$.error").value("Not authenticated"));
  }

  @Test
  void signsInAllowsProtectedApisAndSignsOutAgain() throws Exception {
    MockHttpSession session = signInAsDefaultAdmin();

    mockMvc.perform(get("/api/auth/me").session(session))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.user.username").value("admin"))
      .andExpect(jsonPath("$.user.role").value("ADMIN"));

    mockMvc.perform(get("/api/policies").session(session))
      .andExpect(status().isOk());

    mockMvc.perform(post("/api/auth/logout").session(session))
      .andExpect(status().isOk());

    mockMvc.perform(get("/api/policies").session(session))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void rejectsBadCredentials() throws Exception {
    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(Map.of(
          "username", "admin",
          "password", "wrong-password"
        ))))
      .andExpect(status().isUnauthorized())
      .andExpect(jsonPath("$.error").value("Invalid username or password"));
  }

  private MockHttpSession signInAsDefaultAdmin() throws Exception {
    String payload = objectMapper.writeValueAsString(LoginRequest.builder()
      .username("admin")
      .password(SeedCredentials.defaultAdminPassword())
      .build());

    return (MockHttpSession) Objects.requireNonNull(mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(payload))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.user.username").value("admin"))
      .andReturn()
      .getRequest()
      .getSession(false));
  }
}