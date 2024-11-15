package com.teame.club.category;


import com.teame.club.Club;
import com.teame.club.ClubRepository;
import com.teame.club.ClubService;
import com.teame.club.university.University;
import com.teame.club.university.UniversityRepository;
import com.teame.member.Member;
import com.teame.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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

import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;
  private final ClubRepository clubRepository;
  private final MemberRepository memberRepository;

  public ResponseEntity<?> getClubsByCategory(String category,
                                              String order,
                                              int page,
                                              int size,
                                              PagedResourcesAssembler<Club> assembler) {
    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by(order).descending());

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

  public ResponseEntity<?> getClubsByCategoryAndUniversity(String category,
                                                           String order,
                                                           int page,
                                                           int size,
                                                           PagedResourcesAssembler<Club> assembler,
                                                           String username) {
    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by(order).descending());
      Member member = memberRepository.findByUsername(username);

      Long universityId = member.getUniversityId();

      if (universityId == null) {
        throw new IllegalArgumentException("멤버의 소속 대학교 정보가 없습니다.");
      }

      Category cat = categoryRepository.findByName(category)
          .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + category));

      Specification<Club> categorySpec = (root, query, criteriaBuilder) ->
          criteriaBuilder.isMember(cat, root.get("categories"));

      Specification<Club> universitySpec = (root, query, criteriaBuilder) ->
          root.join("universities").get("id").in(universityId);

      Specification<Club> combinedSpec = Specification.where(categorySpec).and(universitySpec);
      Page<Club> clubPage = clubRepository.findAll(combinedSpec, pageable);

      PagedModel<EntityModel<Club>> pagedModel = assembler.toModel(clubPage);

      return ResponseEntity.status(HttpStatus.OK).body(pagedModel);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 불러오기 실패: " + e.getMessage());
    }
  }

  public ResponseEntity<?> getClubsByCategories(String order,
                                                int page,
                                                int size,
                                                PagedResourcesAssembler<Club> assembler,
                                                String username) {
    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by(order).descending());
      Member member = memberRepository.findByUsername(username);

      List<Long> categoryIds = new ArrayList<>(member.getCategoryIds().stream()
          .map(CategoryId::getId)
          .toList());

      if (categoryIds.isEmpty()) {
        categoryIds.add(1L);
      }

      Specification<Club> categorySpec = (root, query, criteriaBuilder) ->
          root.join("categories").get("id").in(categoryIds);

      Page<Club> clubPage = clubRepository.findAll(categorySpec, pageable);
      PagedModel<EntityModel<Club>> pagedModel = assembler.toModel(clubPage);

      return ResponseEntity.status(HttpStatus.OK).body(pagedModel);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 불러오기 실패: " + e.getMessage());
    }
  }


  public ResponseEntity<?> getClubsByCategoriesAndUniversity(String order,
                                                             int page,
                                                             int size,
                                                             PagedResourcesAssembler<Club> assembler,
                                                             String username) {
    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by(order).descending());
      Member member = memberRepository.findByUsername(username);

      List<Long> categoryIds = new ArrayList<>(member.getCategoryIds().stream()
          .map(CategoryId::getId)
          .toList());

      if (categoryIds.isEmpty()) {
        categoryIds.add(1L);
      }

      log.info(member.getUsername());
      Long universityId = member.getUniversityId();
      log.info(universityId);

      if (universityId == null) {
        throw new IllegalArgumentException("멤버의 소속 대학교 정보가 없습니다.");
      }

      Specification<Club> categorySpec = (root, query, criteriaBuilder) ->
          root.join("categories").get("id").in(categoryIds);

      Specification<Club> universitySpec = (root, query, criteriaBuilder) ->
          root.join("universities").get("id").in(universityId);

      Specification<Club> combinedSpec = Specification.where(categorySpec).and(universitySpec);
      Page<Club> clubPage = clubRepository.findAll(combinedSpec, pageable);

      PagedModel<EntityModel<Club>> pagedModel = assembler.toModel(clubPage);

      return ResponseEntity.status(HttpStatus.OK).body(pagedModel);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 불러오기 실패: " + e.getMessage());
    }
  }
}