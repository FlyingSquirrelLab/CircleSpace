package com.teamE.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@ToString
@Getter
@Setter
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable=false)
  private String username;
  private String displayName;
  private String realName;

  @Column(nullable=false)
  private String password;

  private String phoneNumber;
  private String postCode;
  private String address;
  private String detailAddress;
  private String role;

}

