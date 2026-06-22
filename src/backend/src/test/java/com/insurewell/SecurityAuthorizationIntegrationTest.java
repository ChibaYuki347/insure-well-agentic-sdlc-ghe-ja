package com.insurewell;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityAuthorizationIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  private MockHttpSession login(String username, String password) throws Exception {
    return (MockHttpSession) mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {"username":"%s","password":"%s"}
          """.formatted(username, password)))
      .andExpect(status().isOk())
      .andReturn()
      .getRequest()
      .getSession(false);
  }

  @Test
  void unauthenticatedPoliciesRequestIsRejected() throws Exception {
    mockMvc.perform(get("/api/policies"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void policyholderSeesOnlyOwnedPolicies() throws Exception {
    MockHttpSession session = login("alex", "alex123");

    mockMvc.perform(get("/api/policies").session(session))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(1)))
      .andExpect(jsonPath("$[0].holderName").value("Alex Johnson"));
  }

  @Test
  void policyholderCannotUpdateClaimStatus() throws Exception {
    MockHttpSession session = login("alex", "alex123");

    mockMvc.perform(patch("/api/claims/CLM-1715787000000/status")
        .session(session)
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {"status":"Rejected"}
          """))
      .andExpect(status().isForbidden());
  }

  @Test
  void adminCanViewAllPolicies() throws Exception {
    MockHttpSession session = login("admin", "admin123");

    mockMvc.perform(get("/api/policies").session(session))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(3)));
  }
}