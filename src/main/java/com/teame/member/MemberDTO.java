package com.teame.member;

public class MemberDTO {
  public Long id;
  public String username;
  public String displayName;
  public String role;

  public MemberDTO(Long id, String username, String displayName, String role) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
    this.role = role;
  }

}

