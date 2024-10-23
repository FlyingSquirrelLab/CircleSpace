//package com.teame.member.jwt;
//
//import io.jsonwebtoken.Jwts;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import javax.crypto.spec.SecretKeySpec;
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//
//@Component
//public class JWTUtil {
//
//  private final SecretKey secretKey;
//  private final Long accessTokenValidity = 1000 * 60 * 180L; // 180 minutes
//  private final Long refreshTokenValidity = 1000 * 60 * 60 * 24 * 7L; // 7 days
//
//
//  public JWTUtil(@Value("${spring.jwt.secretKey}") String secretKey) {
//    this.secretKey = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
//  }
//
//  public String getUsername(String token) {
//    return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
//  }
//
//  public String getRole(String token) {
//    return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
//  }
//
//  public Boolean isExpired(String token) {
//    return Jwts.parser()
//        .verifyWith(secretKey)
//        .build()
//        .parseSignedClaims(token)
//        .getPayload()
//        .getExpiration()
//        .before(new Date());
//  }
//
//  public String createAccessToken(String username, String role) {
//    return Jwts.builder()
//        .claim("username", username)
//        .claim("role", role)
//        .issuedAt(new Date(System.currentTimeMillis()))
//        .expiration(new Date(System.currentTimeMillis() + accessTokenValidity))
//        .signWith(secretKey)
//        .compact();
//  }
//
//  public String createRefreshToken(String username, String role) {
//    return Jwts.builder()
//        .claim("username", username)
//        .claim("role", role)
//        .issuedAt(new Date(System.currentTimeMillis()))
//        .expiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
//        .signWith(secretKey)
//        .compact();
//  }
//
//  public boolean validateToken(String token) {
//    try {
//      Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
//      return true;
//    } catch (Exception e) {
//      return false;
//    }
//  }
//
//
//}