//package com.teame.member;
//
//import com.teame.member.customUser.CustomUserDetails;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@Log4j2
//@RestController
//@RequiredArgsConstructor
//public class MemberController {
//
//  private final MemberService memberService;
//
//  @GetMapping("/api/member/fetch")
//  public ResponseEntity<?> getMemberAPI(Authentication auth) {
//    return memberService.getMember(auth);
//  }
//
//  @PostMapping("/api/member/logoutProc")
//  public ResponseEntity<String> logoutProcAPI(@RequestHeader("Authorization") String token) {
//    return memberService.logoutProc(token);
//  }
//
//  @GetMapping("/api/member/fetchUserInfo")
//  public ResponseEntity<?> fetchUserInfoAPI(Authentication auth) {
//    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
//    return memberService.fetchUserInfo(username);
//  }
//
//  @PutMapping("/api/member/editUserInfo")
//  public ResponseEntity<String> editUserInfoAPI(@RequestBody Map<String, Object> request,
//                                                Authentication auth) {
//    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
//    return memberService.editUserInfo(request, username);
//  }
//
//  @PostMapping("/api/member/checkPassword")
//  public ResponseEntity<String> checkPasswordAPI(@RequestBody Map<String, Object> request,
//                                                 Authentication auth) {
//    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
//    return memberService.checkPassword(request, username);
//  }
//
//  @PutMapping("/api/member/editPassword")
//  public ResponseEntity<String> editPasswordAPI(@RequestBody Map<String, Object> request,
//                                                Authentication auth) {
//    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
//    return memberService.editPassword(request, username);
//  }
//
//}