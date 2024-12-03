package com.teame.member;

import com.teame.member.customUser.CustomUserDetails;
import com.teame.member.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;
  private final MemberRepository memberRepository;
  private final JWTUtil jwtUtil;

  @GetMapping("/api/member/fetch")
  public ResponseEntity<?> getMemberAPI(Authentication auth) {
    return memberService.getMember(auth);
  }

  @PostMapping("/api/member/logoutProc")
  public ResponseEntity<String> logoutProcAPI(@RequestHeader("Authorization") String token) {
    return memberService.logoutProc(token);
  }

  @GetMapping("/api/member/fetchUserInfo")
  public ResponseEntity<?> fetchUserInfoAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return memberService.fetchUserInfo(username);
  }

  @PutMapping("/api/member/editUserInfo")
  public ResponseEntity<String> editUserInfoAPI(@RequestBody Map<String, Object> request,
                                                Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return memberService.editUserInfo(request, username);
  }

  @PostMapping("/api/member/checkPassword")
  public ResponseEntity<String> checkPasswordAPI(@RequestBody Map<String, Object> request,
                                                 Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return memberService.checkPassword(request, username);
  }

  @PutMapping("/api/member/editPassword")
  public ResponseEntity<String> editPasswordAPI(@RequestBody Map<String, Object> request,
                                                Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return memberService.editPassword(request, username);
  }

  @PostMapping("/api/member/application")
  public ResponseEntity<?> applicationAPI(@RequestBody Map<String, Object> request,
                                          Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return memberService.application(request, username);
  }

  @PostMapping("/api/member/getMemberships")
  public ResponseEntity<?> getMembershipsAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return memberService.getMemberships(username);
  }

  @GetMapping("/api/member/getMyClubs")
  public ResponseEntity<?> getMyClubsAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return memberService.getMyClubs(username);
  }

  @PostMapping("/api/member/findUserPhoneNumberCheck")
  public ResponseEntity<String> findUserPhoneNumberCheckAPI(@RequestBody String request) {
    return memberService.findUserPhoneNumberCheck(request);
  }

  @PostMapping("/api/member/getTokenByPhone")
  public ResponseEntity<?> getTokenByPhoneAPI(@RequestBody Map<String, String> request) {
    try {
      String phoneNumber = request.get("phoneNumber");

      if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("전화번호 오류입니다.");
      }

      Member member = memberRepository.findByPhoneNumber(phoneNumber.trim());
      String accessToken = jwtUtil.createAccessToken(member.getUsername(), member.getRole());

      Map<String, Object> claims = new HashMap<>();
      claims.put("accessToken", accessToken);
      claims.put("role", member.getRole());
      claims.put("username", member.getUsername());
      claims.put("displayName", member.getDisplayName());
      claims.put("realName", member.getRealName());
      claims.put("phoneNumber", member.getPhoneNumber());

      return ResponseEntity.status(HttpStatus.OK).body(claims);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다." + e.getMessage());
    }
  }

}