package com.teame.club.university;

import com.teame.club.category.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UniversityController {

  private final UniversityRepository universityRepository;

  @GetMapping("/api/university/getAll")
  public ResponseEntity<List<University>> getAllUniversitiesAPI() {
    List<University> universities = universityRepository.findAll();
    return ResponseEntity.ok(universities);
  }

}
