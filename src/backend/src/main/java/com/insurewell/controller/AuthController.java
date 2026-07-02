package com.insurewell.controller;

import com.insurewell.dto.AuthResponseDTO;
import com.insurewell.dto.AuthUserDTO;
import com.insurewell.dto.LoginRequest;
import com.insurewell.model.User;
import com.insurewell.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid username or password";

  private final AuthenticationManager authenticationManager;
  private final SecurityContextRepository securityContextRepository;
  private final UserRepository userRepository;

  public AuthController(AuthenticationManager authenticationManager,
                        SecurityContextRepository securityContextRepository,
                        UserRepository userRepository) {
    this.authenticationManager = authenticationManager;
    this.securityContextRepository = securityContextRepository;
    this.userRepository = userRepository;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                 HttpServletRequest httpRequest,
                                 HttpServletResponse httpResponse) {
    if (request.getUsername() == null || request.getUsername().trim().isEmpty()
      || request.getPassword() == null || request.getPassword().isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "username and password are required"));
    }

    try {
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

      SecurityContext context = SecurityContextHolder.createEmptyContext();
      context.setAuthentication(authentication);
      SecurityContextHolder.setContext(context);
      securityContextRepository.saveContext(context, httpRequest, httpResponse);

      return ResponseEntity.ok(AuthResponseDTO.builder()
        .message("Signed in successfully")
        .user(toUserDTO(authentication.getName()))
        .build());
    } catch (BadCredentialsException ex) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("error", INVALID_CREDENTIALS_MESSAGE));
    } catch (AuthenticationException ex) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("error", INVALID_CREDENTIALS_MESSAGE));
    }
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication) {
    if (authentication == null
      || authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken
      || !authentication.isAuthenticated()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("error", "Not authenticated"));
    }

    return ResponseEntity.ok(AuthResponseDTO.builder()
      .message("Authenticated")
      .user(toUserDTO(authentication.getName()))
      .build());
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
    new SecurityContextLogoutHandler().logout(request, response, authentication);
    return ResponseEntity.ok(Map.of("message", "Signed out"));
  }

  private AuthUserDTO toUserDTO(String username) {
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

    return AuthUserDTO.builder()
      .id(user.getId())
      .username(user.getUsername())
      .displayName(user.getDisplayName())
      .role(user.getRole())
      .build();
  }
}