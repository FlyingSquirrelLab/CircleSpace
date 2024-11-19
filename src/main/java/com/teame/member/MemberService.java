package com.teame.member;

import com.teame.club.ClubRepository;
import com.teame.member.customUser.CustomUserDetails;
import com.teame.member.membership.Membership;
import com.teame.member.membership.MembershipRepository;
import com.teame.member.register.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MemberService {

  private final MemberRepository memberRepository;
  private final TokenBlacklistService tokenBlacklistService;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;
  private final ClubRepository clubRepository;
  private final MembershipRepository membershipRepository;

  public ResponseEntity<?> fetchUserInfo(String username) {
    try {
      Member member = memberRepository.findByUsername(username);
      UserInfoDTO userInfoDTO = new UserInfoDTO();
      userInfoDTO.setUsername(username);
      userInfoDTO.setDisplayName(member.getDisplayName());
      userInfoDTO.setRealName(member.getRealName());
      userInfoDTO.setPhoneNumber(member.getPhoneNumber());
      userInfoDTO.setUniversityId(member.getUniversityId());
      return ResponseEntity.status(HttpStatus.OK).body(userInfoDTO);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fetch User Info Failure" + e.getMessage());
    }
  }

  public ResponseEntity<String> editUserInfo(Map<String, Object> request, String username) {

    try {
      String displayName = (String) request.get("displayName");
      String realName = (String) request.get("realName");

      Member member = memberRepository.findByUsername(username);

      member.setDisplayName(displayName);
      member.setRealName(realName);

      memberRepository.save(member);
      return ResponseEntity.status(HttpStatus.OK).body("User Info Edit Success");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User Info Edit Failure");
    }
  }

  public ResponseEntity<String> checkPassword(Map<String, Object> request,
                                              String username) {
    String prevPassword = (String) request.get("prevPassword");
    Member member = memberRepository.findByUsername(username);

    if (bCryptPasswordEncoder.matches(prevPassword, member.getPassword())) {
      return ResponseEntity.status(HttpStatus.OK).body("Previous Password Match Success");
    } else {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Previous Password Does Not Match");
    }
  }

  public ResponseEntity<String> editPassword(Map<String, Object> request,
                                             String username) {
    try {
      String password = bCryptPasswordEncoder.encode((String) request.get("password"));
      Member member = memberRepository.findByUsername(username);
      member.setPassword(password);
      memberRepository.save(member);
      return ResponseEntity.status(HttpStatus.OK).body("Password Edit Success");
    } catch (Exception e){
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }


  public ResponseEntity<?> getMember(Authentication auth) {
    CustomUserDetails result = (CustomUserDetails) auth.getPrincipal();
    if (result == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원 정보를 찾을 수 없습니다.");
    }

    Member member = memberRepository.findByUsername(result.getUsername());
    if (member == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원정보를 찾을 수 없습니다.");
    }

    MemberDTO memberDTO =
        new MemberDTO(member.getId(), member.getUsername(), member.getDisplayName(), member.getRole());
    return ResponseEntity.status(HttpStatus.OK).body(memberDTO);
  }

  public ResponseEntity<String> logoutProc(String token) {
    if (token != null && token.startsWith("Bearer ")) {
      String jwt = token.substring(7);
      tokenBlacklistService.addTokenToBlacklist(jwt);
      SecurityContextHolder.clearContext();
      return ResponseEntity.status(HttpStatus.OK).body("로그아웃 완료.");
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("토큰 정보가 없습니다.");
  }

  public ResponseEntity<?> application(Map<String, Object> request, String username) {
    Long clubId = Long.parseLong((String) request.get("clubId"));
    String intro = (String) request.get("intro");

    Membership membership = new Membership();

    membership.setMember(memberRepository.findByUsername(username));
    membership.setClub(clubRepository.findById(clubId).
        orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다." + clubId)));
    membership.setIntro(intro);

    membershipRepository.save(membership);
    return ResponseEntity.status(HttpStatus.OK).body("동아리 지원 완료");
  }

  public ResponseEntity<?> getMemberships(String username) {
    try {
      Member member = memberRepository.findByUsername(username);
      List<Membership> memberships = membershipRepository.findByMemberAndApproved(member, Boolean.TRUE);
      return ResponseEntity.status(HttpStatus.OK).body(memberships);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("가입된 동아리 찾는 중 오류 발생");
    }
  }

  public ResponseEntity<?> getMyClubs(String username) {
    try {
      Member member = memberRepository.findByUsername(username);
      return ResponseEntity.status(HttpStatus.OK).body(clubRepository.findByManagerId(member.getId()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Club Not Found");
    }
  }

}