package com.teame.club.category;


import com.teame.club.Club;
import com.teame.club.ClubRepository;
import com.teame.club.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;
  private final ClubRepository clubRepository;

  public ResponseEntity<?> getClubsByCategory(String category,
                                              int page,
                                              int size,
                                              PagedResourcesAssembler<Club> assembler) {
    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

      Category cat = categoryRepository.findByName(category)
          .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + category));

      Specification<Club> categorySpec = (root, query, criteriaBuilder) ->
          criteriaBuilder.isMember(cat, root.get("categories"));

      Page<Club> clubPage = clubRepository.findAll(categorySpec, pageable);

      PagedModel<EntityModel<Club>> pagedModel = assembler.toModel(clubPage);
      return ResponseEntity.status(HttpStatus.OK).body(pagedModel);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 불러오기 실패: " + e.getMessage());
    }
  }

}