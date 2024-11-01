package com.teame.member.jwt;

import com.google.gson.Gson;
import com.teame.member.customUser.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Log4j2
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

  private final AuthenticationManager authenticationManager;
  private final JWTUtil jwtUtil;

  public LoginFilter(AuthenticationManager authenticationManager,JWTUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
    setFilterProcessesUrl("/api/loginProc");
  }


  @Override
  public Authentication attemptAuthentication(HttpServletRequest request,
                                              HttpServletResponse response)
      throws AuthenticationException {
    String username = obtainUsername(request);
    String password = obtainPassword(request);

    log.info(username);

    UsernamePasswordAuthenticationToken authToken =
        new UsernamePasswordAuthenticationToken(username, password, null);

    return authenticationManager.authenticate(authToken);
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request,
                                          HttpServletResponse response,
                                          FilterChain chain,
                                          Authentication authentication)
      throws IOException {
    CustomUserDetails customUserDetails =
        (CustomUserDetails) authentication.getPrincipal();
    String username = customUserDetails.getUsername();
    String displayName = customUserDetails.getDisplayName();

    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
    GrantedAuthority auth = iterator.next();

    String role = auth.getAuthority();
    log.info(role);

    Map<String, Object> claims = new HashMap<>();

    String accessToken = jwtUtil.createAccessToken(username, role);
//    String refreshToken = jwtUtil.createRefreshToken(username, role);

    claims.put("accessToken", accessToken);
    claims.put("username", username);
    claims.put("displayName", displayName);
    claims.put("role", role);
//    claims.put("refreshToken", refreshToken);

    Gson gson = new Gson();
    String jsonStr = gson.toJson(claims);

    // Header 로 토큰 전송
    response.addHeader("Authorization", "Bearer " + accessToken);
//    response.addHeader("Refresh-Token", refreshToken);


    response.setContentType("application/json; charset=UTF-8");
    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);
    printWriter.close();
  }

  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            AuthenticationException failed) throws IOException {
    log.info("Login Fail");

    Gson gson = new Gson();
    String jsonStr = gson.toJson(Map.of("error", "ERROR_LOGIN"));

    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 상태 코드 설정
    response.setContentType("application/json");
    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);
    printWriter.close();
  }


}