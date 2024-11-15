package com.teame.club.university;

import com.teame.club.category.Category;
import com.teame.club.category.CategoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class UniversityController {

  private final UniversityRepository universityRepository;

  @GetMapping("/api/university/getAll")
  public ResponseEntity<List<UniversityDTO>> getAllUniversitiesAPI() {
    List<University> unis = universityRepository.findAll();
    List<UniversityDTO> universities = unis.stream().map(university -> {
      UniversityDTO universityDTO = new UniversityDTO();
      universityDTO.setId(university.getId());
      universityDTO.setCode(university.getCode());
      universityDTO.setTitle(university.getTitle());
      return universityDTO;
    }).collect(Collectors.toList());
    return ResponseEntity.ok(universities);
  }

}
