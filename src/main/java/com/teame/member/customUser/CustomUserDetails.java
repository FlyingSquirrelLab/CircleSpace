//package com.teame.member.customUser;
//
//import lombok.Getter;
//import lombok.RequiredArgsConstructor;
//import lombok.Setter;
//import com.teame.member.Member;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.ArrayList;
//import java.util.Collection;
//
//@Getter
//@Setter
//@RequiredArgsConstructor
//public class CustomUserDetails implements UserDetails {
//
//  private final Member member;
//
//  @Override
//  public Collection<? extends GrantedAuthority> getAuthorities() {
//    Collection<GrantedAuthority> collection = new ArrayList<>();
//    collection.add(member::getRole);
//    return collection;
//  }
//
//
//  public String getDisplayName() {
//    return member.getDisplayName();
//  }
//
//  @Override
//  public String getPassword() {
//    return member.getPassword();
//  }
//
//  @Override
//  public String getUsername() {
//    return member.getUsername();
//  }
//
//  @Override
//  public boolean isAccountNonExpired() {
//    return true;
//  }
//
//  @Override
//  public boolean isAccountNonLocked() {
//    return true;
//  }
//
//  @Override
//  public boolean isCredentialsNonExpired() {
//    return true;
//  }
//
//  @Override
//  public boolean isEnabled() {
//    return true;
//  }
//
//}
