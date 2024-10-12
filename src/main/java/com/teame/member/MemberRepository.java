package com.teame.member;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

  boolean existsByUsername(String username);

  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByDisplayName(String displayName);

  Member findByUsername(String username);

}
