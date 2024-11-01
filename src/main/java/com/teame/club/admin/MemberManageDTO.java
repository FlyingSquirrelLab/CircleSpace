package com.teame.club.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class MemberManageDTO {

  private Long id;
  private String username;
  private String displayName;
  private String realName;
  private LocalDateTime createdAt;

}
