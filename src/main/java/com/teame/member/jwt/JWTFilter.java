package com.teame.member.jwt;

import com.teame.member.Member;
import com.teame.member.customUser.CustomUserDetails;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Log4j2
public class JWTFilter extends OncePerRequestFilter {

  private final JWTUtil jwtUtil;

  public JWTFilter(JWTUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

    String authorization= request.getHeader("Authorization");
    String refreshToken = request.getHeader("Refresh-Token");

    try {
      if (authorization == null || !authorization.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
      }

      String token = authorization.split(" ")[1];

      if (jwtUtil.isExpired(token)) {
        if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
          String username = jwtUtil.getUsername(refreshToken);
          String role = jwtUtil.getRole(refreshToken);
          String newAccessToken = jwtUtil.createAccessToken(username, role);

          response.addHeader("Authorization", "Bearer " + newAccessToken);
        } else {
          response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
          response.getWriter().write("Refresh Token is invalid or expired");
          return;
        }
      } else {
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        Member member = new Member();
        member.setUsername(username);
        member.setPassword("temppassword");
        member.setRole(role);

        CustomUserDetails customUserDetails = new CustomUserDetails(member);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
      }
    } catch (ExpiredJwtException e) {
      log.error("JWT expired: {}", e.getMessage());
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Access Token is expired");
      return;
    } catch (JwtException e) {
      log.error("JWT validation error: {}", e.getMessage());
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Invalid JWT token");
      return;
    } catch (Exception e) {
      log.error("Unexpected error: {}", e.getMessage());
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response.getWriter().write("An unexpected error occurred");
      return;
    }

    filterChain.doFilter(request, response);
  }

}