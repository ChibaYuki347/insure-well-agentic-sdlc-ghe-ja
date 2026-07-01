package com.insurewell.security;

import com.insurewell.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT filter that validates ****** on each request.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private UserRepository userRepository;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
      throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
      if (jwtUtil.isTokenValid(token)) {
        String username = jwtUtil.extractUsername(token);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
          // Load role from the database so that role changes take effect immediately
          // without waiting for token expiry, and reduce blast-radius if the signing key leaks.
          userRepository.findByUsername(username).ifPresent(user -> {
            var auth = new UsernamePasswordAuthenticationToken(
              username, null,
              List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
          });
        }
      }
    }
    filterChain.doFilter(request, response);
  }
}
