package com.teame.club.like;

import com.teame.club.Club;
import com.teame.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Long> {


  List<Like> findByMemberId(Long id);
  Like findByMemberAndClub(Member member, Club club);
  List<Like> findByClub(Club club);

}

