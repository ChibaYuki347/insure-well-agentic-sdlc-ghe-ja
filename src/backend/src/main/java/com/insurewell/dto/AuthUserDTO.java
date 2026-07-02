package com.insurewell.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authenticated user summary returned by auth endpoints.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthUserDTO {
  private Long id;
  private String username;
  private String displayName;
  private String role;
}