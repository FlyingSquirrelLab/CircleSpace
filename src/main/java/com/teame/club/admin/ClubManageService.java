package com.teame.club.admin;

import com.teame.club.Club;
import com.teame.club.ClubRepository;
import com.teame.club.category.Category;
import com.teame.club.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Log4j2
@Service
@RequiredArgsConstructor
public class ClubManageService {

  private final CategoryRepository categoryRepository;
  private final ClubRepository clubRepository;

  public ResponseEntity<Void> deleteCategory(Long id) {
    try {
      Category category = categoryRepository.findById(id)
          .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + id));

      for (Club club : category.getClubs()) {
        club.getCategories().remove(category);
        clubRepository.save(club);
      }

      categoryRepository.delete(category);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "카테고리 삭제 실패: " + e.getMessage());
    }
  }

  public ResponseEntity<String> setFeatured(Long id, Boolean featured) {
    try {
      Club club = clubRepository.findById(id).orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));
      club.setFeatured(featured);
      clubRepository.save(club);
      return ResponseEntity.status(HttpStatus.OK).body("추천 동아리 설정 완료");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("추천 동아리 설정 실패" + e.getMessage());
    }
  }



}
