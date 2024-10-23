package com.teame.club.category;


import com.teame.club.Club;
import com.teame.club.ClubRepository;
import com.teame.club.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;
  private final ClubRepository clubRepository;
  private final ClubService clubService;

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

  public ResponseEntity<?> getClubsByCategory(String category) {
    try {
      Category cat = categoryRepository.findByName(category)
          .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + category));

      Set<Club> clubs = cat.getClubs();
      return ResponseEntity.status(HttpStatus.OK).body(clubs.stream()
          .map(clubService::setClubDTO)
          .collect(Collectors.toList()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 불러오기 실패" + e.getMessage());
    }
  }

}