package com.teame.member.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class JWTController {

  private final JWTUtil jwtUtil;

  @PostMapping("/api/auth/refresh-token")
  public ResponseEntity<?> refreshAccessToken(@RequestHeader("Refresh-Token") String refreshToken) {
    if (jwtUtil.validateToken(refreshToken)) {

      String username = jwtUtil.getUsername(refreshToken);
      String role = jwtUtil.getRole(refreshToken);
      String newAccessToken = jwtUtil.createAccessToken(username, role);

      return ResponseEntity.ok().header("Authorization", "Bearer " + newAccessToken).body("Access Token has been refreshed");
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
    }
  }

}
