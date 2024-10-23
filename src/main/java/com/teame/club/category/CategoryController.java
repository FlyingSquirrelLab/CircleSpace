package com.teame.club.category;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService categoryService;
  private final CategoryRepository categoryRepository;

  @GetMapping("/api/category/getAll")
  public ResponseEntity<List<Category>> getAllCategoriesAPI() {
    List<Category> categories = categoryRepository.findAll();
    return ResponseEntity.ok(categories);
  }

  @PostMapping("/api/admin/category/add")
  public ResponseEntity<Category> addCategoryAPI(@RequestBody Category category) {
    Category savedCategory = categoryRepository.save(category);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
  }

  @PutMapping("/api/admin/category/update/{id}")
  public ResponseEntity<Category> updateCategory(@PathVariable Long id,
                                                 @RequestBody Category newCategoryData) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + id));
    category.setName(newCategoryData.getName());
    categoryRepository.save(category);
    return ResponseEntity.ok(category);
  }

  @DeleteMapping("/api/admin/category/delete/{id}")
  public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
    return categoryService.deleteCategory(id);
  }

}
