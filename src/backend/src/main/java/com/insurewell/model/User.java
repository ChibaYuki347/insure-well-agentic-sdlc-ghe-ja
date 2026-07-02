package com.insurewell.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Application user entity for local sign-in and authorization.
 */
@Entity
@Table(name = "app_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false)
  private String passwordHash;

  @Column(nullable = false)
  @Builder.Default
  private String role = "USER";

  @Column(nullable = false)
  private String displayName;

  @Column(nullable = false)
  @Builder.Default
  private boolean enabled = true;

  @PrePersist
  protected void onCreate() {
    if (displayName == null || displayName.trim().isEmpty()) {
      displayName = username;
    }
    if (role == null || role.trim().isEmpty()) {
      role = "USER";
    }
  }
}