package com.teamE.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
  private String role;
  private String affiliation;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

}
