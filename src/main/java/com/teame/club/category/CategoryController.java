package com.teame.club.category;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryRepository categoryRepository;

  @GetMapping("/api/category/getAll")
  public ResponseEntity<List<Category>> getAllCategoriesAPI() {
    List<Category> categories = categoryRepository.findAll();
    return ResponseEntity.ok(categories);
  }
}
