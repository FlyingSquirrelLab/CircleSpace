package com.teame.member.membership;

import com.teame.club.Club;
import com.teame.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@ToString
@Getter
@Setter
public class Membership {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "member_id")
  private Member member;

  @ManyToOne
  @JoinColumn(name = "club_id")
  private Club club;

  private boolean approved;

  private LocalDateTime requestDate;

  private LocalDateTime approvalDate;

}