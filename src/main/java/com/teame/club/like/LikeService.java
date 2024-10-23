package com.teame.club.like;

import com.teame.club.Club;
import com.teame.club.ClubRepository;
import com.teame.member.Member;
import com.teame.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

  private final MemberRepository memberRepository;
  private final ClubRepository clubRepository;
  private final LikeRepository likeRepository;

  @Transactional(readOnly = true)
  public boolean isClubLikedByMember(String username, Long clubId) {
    Member member = memberRepository.findByUsername(username);
    if (member == null) {
      throw new IllegalArgumentException("회원정보를 찾을 수 없습니다.");
    }

    Club club = clubRepository.findById(clubId)
        .orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다: " + clubId));

    Like existingLike = likeRepository.findByMemberAndClub(member, club);
    return existingLike != null;
  }

  @Transactional
  public ResponseEntity<String> addToLike(String username, String title) {

    Member member = memberRepository.findByUsername(username);
    if (member == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원정보를 찾을 수 없습니다.");
    }

    Club club = clubRepository.findByTitle(title)
        .orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다: " + title));

    Like exsistingLike = likeRepository.findByMemberAndClub(member, club);

    if (exsistingLike != null) {
      return ResponseEntity.status(HttpStatus.OK).body("Already Liked");
    } else {
      Like like = new Like();
      like.setMember(member);
      like.setClub(club);
      likeRepository.save(like);
    }

    return ResponseEntity.ok("Added to Like");
  }

  @Transactional
  public ResponseEntity<String> deleteFromLike(String username, String title) {
    Member member = memberRepository.findByUsername(username);
    if (member == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원정보를 찾을 수 없습니다.");
    }

    Club club = clubRepository.findByTitle(title)
        .orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다: " + title));

    Like exsistingLike = likeRepository.findByMemberAndClub(member, club);
    if (exsistingLike == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("동아리가 좋아요 목록에 없습니다.");
    }

    likeRepository.delete(exsistingLike);
    return ResponseEntity.ok("좋아요 목록에서 동아리 삭제 완료.");
  }

  @Transactional(readOnly = true)
  public List<FetchLikeDTO> fetchLike(String username) {
    Member member = memberRepository.findByUsername(username);
    if (member == null) {
      throw new IllegalArgumentException("회원정보를 찾을 수 없습니다.");
    }

    List<Like> likeList = likeRepository.findByMemberId(member.getId());

    return likeList.stream().map(like -> {
      FetchLikeDTO dto = new FetchLikeDTO();
      dto.setId(like.getClub().getId());
      dto.setTitle(like.getClub().getTitle());
      dto.setImageUrl(like.getClub().getImageUrl());
      return dto;

    }).collect(Collectors.toList());
  }

}
