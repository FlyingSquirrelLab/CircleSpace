package com.teame.club.category;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.teame.club.Club;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @ManyToMany(mappedBy = "categories")
  @JsonBackReference
  private Set<Club> clubs = new HashSet<>();

}
