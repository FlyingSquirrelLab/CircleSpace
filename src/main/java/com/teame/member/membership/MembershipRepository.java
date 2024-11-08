package com.teame.member.membership;

import com.teame.club.Club;
import com.teame.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

  List<Membership> findByClubAndApproved(Club club, Boolean approved);

  List<Membership> findByMemberAndApproved(Member member, Boolean approved);

  Membership findByClubAndMember(Club club, Member member);

}

