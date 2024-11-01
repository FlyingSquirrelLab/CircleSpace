package com.teame.club.admin;

import com.teame.club.category.Category;
import com.teame.club.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequiredArgsConstructor
public class ClubManageController {

  private final CategoryRepository categoryRepository;
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
  public ResponseEntity<Category> updateCategory(@PathVariable Long id,
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


}
