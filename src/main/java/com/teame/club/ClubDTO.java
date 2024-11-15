package com.teame.club;

import com.teame.club.category.Category;
import com.teame.club.university.University;
import com.teame.member.Member;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ClubDTO {

  private Long id;
  private String title;
  private Long managerId;
  private String description;

  private String imageUrl;
  private List<DetailImage> detailImages;

  private Set<Category> categories;
  private Set<University> universities;
  private Set<Member> members;

  private Boolean united;
  private String period;
  private String fee;
  private String target;
  private String note;
  private String activity;
  private String contact;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

}
