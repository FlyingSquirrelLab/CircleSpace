package com.teame.member.membership;

import com.teame.club.Club;
import com.teame.club.ClubRepository;
import com.teame.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MembershipService {

  private final MemberRepository memberRepository;
  private final ClubRepository clubRepository;
  private final MembershipRepository membershipRepository;

  public ResponseEntity<?> applicationProc(Map<String, Object> request,
                                           String username) {
    try {
      Long clubId = Long.parseLong((String) request.get("clubId"));
      String intro = (String) request.get("intro");

      Membership membership = new Membership();
      membership.setMember(memberRepository.findByUsername(username));
      membership.setIntro(intro);
      membership.setClub(clubRepository.findById(clubId).orElseThrow(() ->
          new IllegalArgumentException("동아리를 찾을 수 없습니다. " + clubId)));
      membershipRepository.save(membership);
      return ResponseEntity.status(HttpStatus.OK).body("동아리 지원 완료");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 지원 실패 " + e.getMessage());
    }
  }

  public ResponseEntity<?> fetchPending(Long clubId) {
    try {
      Club club = clubRepository.findById(clubId).orElseThrow(() ->
          new IllegalArgumentException("동아리를 찾을 수 없습니다. " + clubId));

      List<Membership> pending = membershipRepository.findByClubAndApproved(club, false);
      List<PendingDTO> pendingDTOList = pending.stream()
          .map(this::setPendingDTO)
          .toList();
      return ResponseEntity.status(HttpStatus.OK).body(pendingDTOList);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 지원자 수신 실패" + e.getMessage());
    }
  }

  public ResponseEntity<?> fetchApproved(Long clubId) {
    try {
      Club club = clubRepository.findById(clubId).orElseThrow(() ->
          new IllegalArgumentException("동아리를 찾을 수 없습니다. " + clubId));

      List<Membership> approved = membershipRepository.findByClubAndApproved(club, true);
      List<ApprovedDTO> approvedDTOList = approved.stream()
          .map(this::setApprovedDTO)
          .toList();
      return ResponseEntity.status(HttpStatus.OK).body(approvedDTOList);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 합격자 수신 실패" + e.getMessage());
    }
  }

  public ResponseEntity<?> deleteMembership(Long id) {
    try {
      membershipRepository.deleteById(id);
      return ResponseEntity.status(HttpStatus.OK).body("Membership Delete 완료 ");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Membership Delete 실패 " + e.getMessage());
    }
  }

  public ResponseEntity<?> approveMembership(Long id) {
    try {
      Membership membership = membershipRepository.findById(id).orElseThrow(() ->
          new IllegalArgumentException("Membership 을 찾을 수 없음" + id));
      membership.setApprovalDate(LocalDateTime.now());
      membership.setApproved(true);
      membershipRepository.save(membership);
      return ResponseEntity.status(HttpStatus.OK).body("Membership Approval 완료 ");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Membership Approval 실패 " + e.getMessage());
    }
  }

  public ResponseEntity<?> fetchMyMemberships(String username) {
    try {
      List<Membership> memberships =
          membershipRepository.findByMemberAndApproved(memberRepository.findByUsername(username), true);
      List<MembershipDTO> membershipDTOList = memberships.stream()
          .map(this::setMembershipDTO)
          .toList();
      return ResponseEntity.status(HttpStatus.OK).body(membershipDTOList);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Membership 조회 실패 " + e.getMessage());
    }
  }

  public MembershipDTO setMembershipDTO(Membership membership) {
    MembershipDTO membershipDTO = new MembershipDTO();
    membershipDTO.setTitle(membership.getClub().getTitle());
    membershipDTO.setId(membership.getId());
    membershipDTO.setClubId(membership.getClub().getId());
    membershipDTO.setImageUrl(membership.getClub().getImageUrl());
    membershipDTO.setApprovalDate(membership.getApprovalDate());
    return membershipDTO;
  }

  public PendingDTO setPendingDTO(Membership membership) {
    PendingDTO pendingDTO = new PendingDTO();
    pendingDTO.setMembershipId(membership.getId());
    pendingDTO.setIntro(membership.getIntro());
    pendingDTO.setUsername(membership.getMember().getUsername());
    pendingDTO.setRealName(membership.getMember().getRealName());
    pendingDTO.setRequestDate(membership.getRequestDate());
    return pendingDTO;
  }

  public ApprovedDTO setApprovedDTO(Membership membership) {
    ApprovedDTO approvedDTO = new ApprovedDTO();
    approvedDTO.setMembershipId(membership.getId());
    approvedDTO.setUsername(membership.getMember().getUsername());
    approvedDTO.setRealName(membership.getMember().getRealName());
    approvedDTO.setPhoneNumber(membership.getMember().getPhoneNumber());
    approvedDTO.setIntro(membership.getIntro());
    approvedDTO.setRequestDate(membership.getRequestDate());
    approvedDTO.setApprovalDate(membership.getApprovalDate());
    return approvedDTO;
  }




}
