package com.insurewell.config;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Deterministic seed credentials for local development and tests.
 */
public final class SeedCredentials {

  private static final String ADMIN_PASSWORD_SEED = "insurewell-default-admin";

  private SeedCredentials() {
  }

  public static String defaultAdminPassword() {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(ADMIN_PASSWORD_SEED.getBytes(StandardCharsets.UTF_8));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
    } catch (NoSuchAlgorithmException ex) {
      throw new IllegalStateException("Unable to derive default admin password", ex);
    }
  }
}