package com.insurewell.controller;

import com.insurewell.dto.LoginRequest;
import com.insurewell.dto.LoginResponse;
import com.insurewell.model.User;
import com.insurewell.repository.UserRepository;
import com.insurewell.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Authentication controller.
 * Handles login and provides JWT tokens.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtUtil jwtUtil;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    if (request.getUsername() == null || request.getUsername().trim().isEmpty()
        || request.getPassword() == null || request.getPassword().trim().isEmpty()) {
      return ResponseEntity.badRequest()
        .body(Map.of("error", "ユーザー名とパスワードを入力してください。"));
    }

    Optional<User> userOpt = userRepository.findByUsername(request.getUsername().trim());
    if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
      return ResponseEntity.status(401)
        .body(Map.of("error", "認証に失敗しました。ユーザー名またはパスワードが正しくありません。"));
    }

    User user = userOpt.get();
    String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
    return ResponseEntity.ok(LoginResponse.builder()
      .token(token)
      .username(user.getUsername())
      .role(user.getRole())
      .build());
  }
}
