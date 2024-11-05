package com.teame.member;

import com.teame.club.Club;
import com.teame.club.like.Like;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
  private String schoolCode;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Like> likes = new ArrayList<>();

}
