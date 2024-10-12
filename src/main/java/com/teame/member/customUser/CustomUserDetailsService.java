package com.teame.member.customUser;

import com.teame.member.Member;
import com.teame.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final MemberRepository memberRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    Member memberData = memberRepository.findByUsername(username);

    if (memberData != null) {
      return new CustomUserDetails(memberData);
    } else {
      throw new UsernameNotFoundException("회원 정보가 없습니다.");
    }

  }

}

