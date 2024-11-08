package com.teame.club;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.teame.club.category.Category;
import com.teame.club.university.University;
import com.teame.member.Member;
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
@Getter
@Setter
@ToString
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Club {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable=false)
  private String title;

  private Long managerId;

  private Long views;

  private String description;

  private String imageUrl;

  private Boolean featured = false;

  @ElementCollection
  @CollectionTable(name = "club_detail_image", joinColumns = @JoinColumn(name = "club_id"))
  private List<DetailImage> detailImages = new ArrayList<>();

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(
      name = "club_university",
      joinColumns = @JoinColumn(name = "club_id"),
      inverseJoinColumns = @JoinColumn(name = "university_id")
  )
  private Set<University> universities = new HashSet<>();


  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(
      name = "club_category",
      joinColumns = @JoinColumn(name = "club_id"),
      inverseJoinColumns = @JoinColumn(name = "category_id")
  )
  private Set<Category> categories = new HashSet<>();

  public void addCategory(Category category) {
    this.categories.add(category);
    category.getClubs().add(this);
  }

  public void addUniversity(University university) {
    this.universities.add(university);
    university.getClubs().add(this);
  }

}




