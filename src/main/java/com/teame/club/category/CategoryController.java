package com.teame.club.category;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryRepository categoryRepository;

  @GetMapping("/api/category/getAll")
  public ResponseEntity<List<CategoryDTO>> getAllCategoriesAPI() {
    List<Category> cats = categoryRepository.findAll();
    List<CategoryDTO> categories = cats.stream().map(category -> {
      CategoryDTO categoryDTO = new CategoryDTO();
      categoryDTO.setId(category.getId());
      categoryDTO.setName(category.getName());
      return categoryDTO;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(categories);
  }
}
