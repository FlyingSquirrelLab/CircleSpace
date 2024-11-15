package com.teame.club.category;


import com.teame.club.Club;
import com.teame.club.ClubRepository;
import com.teame.club.ClubService;
import com.teame.club.university.University;
import com.teame.club.university.UniversityRepository;
import com.teame.member.Member;
import com.teame.member.MemberRepository;
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

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;
  private final ClubRepository clubRepository;
  private final UniversityRepository universityRepository;
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

  public ResponseEntity<?> getClubsByCategoryAndUsername(String category,
                                                           String username,
                                                           String order,
                                                           int page,
                                                           int size,
                                                           PagedResourcesAssembler<Club> assembler) {
    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by(order).descending());

      Category cat = categoryRepository.findByName(category)
          .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + category));

      Member member = memberRepository.findByUsername(username);

      University uni = universityRepository.findById(member.getUniversityId())
          .orElseThrow(() -> new IllegalArgumentException("대학교를 찾을 수 없습니다: " + member.getUniversityId()));

      Specification<Club> categorySpec = (root, query, criteriaBuilder) ->
          criteriaBuilder.isMember(cat, root.get("categories"));

      Specification<Club> universitySpec = (root, query, criteriaBuilder) ->
          criteriaBuilder.isMember(uni, root.get("universities"));

      Specification<Club> combinedSpec = Specification.where(categorySpec).and(universitySpec);
      Page<Club> clubPage = clubRepository.findAll(combinedSpec, pageable);

      PagedModel<EntityModel<Club>> pagedModel = assembler.toModel(clubPage);
      return ResponseEntity.status(HttpStatus.OK).body(pagedModel);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 불러오기 실패: " + e.getMessage());
    }
  }

}