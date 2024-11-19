package com.teame.member.membership;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MembershipDTO {

  private Long id;

  private Long clubId;

  private String title;

  private String imageUrl;

  private LocalDateTime approvalDate;

}
