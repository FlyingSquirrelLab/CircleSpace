package com.teame.member.membership;

import com.teame.member.customUser.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
public class MembershipController {

  private final MembershipService membershipService;

  @PostMapping("/api/membership/application")
  public ResponseEntity<?> applicationProcAPI(@RequestBody Map<String, Object> request,
                                              Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return membershipService.applicationProc(request, username);
  }

  @GetMapping("/api/membership/fetchPending/{clubId}") // 페이지네이션 추가 ?
  public ResponseEntity<?> fetchPendingMembershipsAPI(@PathVariable Long clubId) {
    return membershipService.fetchPending(clubId);
  }

  @GetMapping("/api/membership/fetchApproved/{clubId}") // 페이지네이션 추가 ?
  public ResponseEntity<?> fetchApprovedMembershipsAPI(@PathVariable Long clubId) {
    return membershipService.fetchApproved(clubId);
  }

  @PutMapping("/api/membership/approve/{id}")
  public ResponseEntity<?> approveMembershipAPI(@PathVariable Long id) {
    return membershipService.approveMembership(id);
  }

  @DeleteMapping("/api/membership/delete/{id}")
  public ResponseEntity<?> deleteMembershipAPI(@PathVariable Long id) {
    return membershipService.deleteMembership(id);
  }

  @GetMapping("/api/membership/fetchMine")
  public ResponseEntity<?> fetchMyMembershipsAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return membershipService.fetchMyMemberships(username);
  }

}
