package com.teame.club.admin;

import com.teame.club.category.Category;
import com.teame.club.category.CategoryRepository;
import com.teame.club.university.University;
import com.teame.club.university.UniversityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
public class ClubManageController {

  private final CategoryRepository categoryRepository;
  private final UniversityRepository universityRepository;
  private final ClubManageService clubManageService;

  @PutMapping("/api/admin/featureClubById/{id}")
  public ResponseEntity<String> featureClubAPI(@PathVariable Long id) {
    return clubManageService.setFeatured(id, true);
  }

  @PutMapping("/api/admin/unfeatureClubById/{id}")
  public ResponseEntity<String> unfeatureClubAPI(@PathVariable Long id) {
    return clubManageService.setFeatured(id, false);
  }

  @PostMapping("/api/admin/category/add")
  public ResponseEntity<Category> addCategoryAPI(@RequestBody Category category) {
    Category savedCategory = categoryRepository.save(category);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
  }

  @PutMapping("/api/admin/category/updateById/{id}")
  public ResponseEntity<Category> updateCategoryAPI(@PathVariable Long id,
                                                 @RequestBody Category newCategoryData) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + id));
    category.setName(newCategoryData.getName());
    categoryRepository.save(category);
    return ResponseEntity.ok(category);
  }

  @DeleteMapping("/api/admin/category/deleteById/{id}")
  public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
    return clubManageService.deleteCategory(id);
  }


  @PostMapping("/api/admin/university/add")
  public ResponseEntity<University> addCategoryAPI(@RequestBody Map<String, Object> request) {
    String title = (String) request.get("title");
    String code = (String) request.get("code");
    University newUniversity = new University();
    newUniversity.setTitle(title);
    newUniversity.setCode(code);
    University savedUniversity = universityRepository.save(newUniversity);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUniversity);
  }

  @PutMapping("/api/admin/university/updateById/{id}")
  public ResponseEntity<University> updateUniversityAPI(@PathVariable Long id,
                                                        @RequestBody Map<String, Object> request) {
    University university = universityRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("대학교를 찾을 수 없습니다: " + id));
    String title = (String) request.get("title");
    String code = (String) request.get("code");
    university.setTitle(title);
    university.setCode(code);
    University updatedUniversity = universityRepository.save(university);
    return ResponseEntity.ok(updatedUniversity);
  }

  @DeleteMapping("/api/admin/university/deleteById/{id}")
  public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
    return clubManageService.deleteUniversity(id);
  }

}
