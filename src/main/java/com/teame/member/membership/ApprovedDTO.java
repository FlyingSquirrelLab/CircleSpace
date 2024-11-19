package com.teame.member.membership;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApprovedDTO {

  private Long membershipId;

  private String username;

  private String realName;

  private String intro;

  private String phoneNumber;

  private LocalDateTime requestDate;

  private LocalDateTime approvalDate;

}
