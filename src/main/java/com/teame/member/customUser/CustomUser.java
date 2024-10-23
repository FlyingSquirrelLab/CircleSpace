//package com.teame.member.customUser;
//
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
//import com.teame.member.Member;
//
//import java.util.Collections;
//
//@Getter
//@Setter
//public class CustomUser extends User {
//
//  public Long id;
//  public String username;
//  public String displayName;
//  public String role;
//
//
//  public CustomUser(Member member) {
//    super(member.getUsername(), member.getPassword(), Collections.singletonList(new SimpleGrantedAuthority(member.getRole())));
//    this.id = member.getId();
//    this.displayName = member.getDisplayName();
//    this.role = member.getRole();
//
//  }
//
//
//
//}
