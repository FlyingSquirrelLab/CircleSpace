package com.teame.club;

import com.teame.club.category.Category;
import com.teame.club.category.CategoryRepository;
import com.teame.club.university.University;
import com.teame.club.university.UniversityRepository;
import com.teame.s3.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class ClubService {

  private final ClubRepository clubRepository;
  private final S3Service s3Service;
  private final CategoryRepository categoryRepository;
  private final UniversityRepository universityRepository;

  public ResponseEntity<?> getById(Long id) {
    try {
      Club club = clubRepository.findById(id).
          orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다." + id));

      return ResponseEntity.status(HttpStatus.OK).body(setClubDTO(club));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("동아리 불러오기 실패" + e.getMessage());
    }
  }

  public ResponseEntity<String> uploadClub(Map<String, Object> request, Long id) {
    try {
      Club club = new Club();
      String title = (String) request.get("title");
      String imageUrl = s3Service.getObjectUrl((String) request.get("imagePath"));
      String description = (String) request.get("description");
      List<String> categoryNames = (List<String>) request.get("categoryNames");
      List<String> universityTitles = (List<String>) request.get("universityTitles");

      club.setManagerId(id);
      club.setTitle(title);
      club.setImageUrl(imageUrl);
      club.setDescription(description);

      List<String> detailImagePaths = (List<String>) request.get("detailImagePaths");
      List<DetailImage> detailImages = detailImagePaths.stream()
          .map(path -> {
            DetailImage detailImage = new DetailImage();
            detailImage.setImageUrl(s3Service.getObjectUrl(path));
            return detailImage;
          })
          .collect(Collectors.toList());

      club.setDetailImages(detailImages);

      for (String categoryName : categoryNames) {
        Category category = categoryRepository.findByName(categoryName)
            .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryName));
        club.addCategory(category);
      }

      for (String universityTitle : universityTitles) {
        University university = universityRepository.findByTitle(universityTitle)
            .orElseThrow(() -> new IllegalArgumentException("University Not Found" + universityTitle));
        club.addUniversity(university);
      }

      clubRepository.save(club);
      log.info("동아리 등록 완료 {}", club.getTitle());
      return ResponseEntity.ok(club.getTitle());
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "동아리 등록 실패" + e.getMessage());
    }
  }

  public ResponseEntity<String> editClubProc(Map<String, Object> request, Long clubId) {
    try {
      Optional<Club> clubOptional = clubRepository.findById(clubId);

      if (clubOptional.isPresent()) {

        Club club = clubOptional.get();

        String title = (String) request.get("title");
        String imageUrl;

        if (!Objects.equals(request.get("imagePath"), club.getImageUrl())) {
          imageUrl = s3Service.getObjectUrl((String) request.get("imagePath"));
        } else {
          imageUrl = (String) request.get("imagePath");
        }

        String description = (String) request.get("description");
        List<String> categoryNames = (List<String>) request.get("categoryNames");
        List<String> universityTitles = (List<String>) request.get("universityTitles");

        club.setTitle(title);
        club.setImageUrl(imageUrl);
        club.setDescription(description);

        club.getCategories().clear();
        for (String categoryName : categoryNames) {
          Category category = categoryRepository.findByName(categoryName)
              .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryName));
          club.addCategory(category);
        }

        club.getUniversities().clear();
        for (String universityTitle : universityTitles) {
          University university = universityRepository.findByTitle(universityTitle)
              .orElseThrow(() -> new IllegalArgumentException("University Not Found" + universityTitle));
          club.addUniversity(university);
        }

        clubRepository.save(club);
        return ResponseEntity.status(HttpStatus.OK).body("동아리 수정 완료");
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("동아리가 존재하지 않습니다.");
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동아리 수정 실패" + e.getMessage());
    }
  }

  public ResponseEntity<String> deleteClub(Long id) {
    Optional<Club> club = clubRepository.findById(id);
    if (club.isPresent()) {
      for (Category category : club.get().getCategories()) {
        category.getClubs().remove(club.get());
        categoryRepository.save(category);
      }
      clubRepository.delete(club.get());
      return ResponseEntity.status(HttpStatus.OK).body("동아리 삭제 완료");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 동아리는 존재하지 않습니다.");
    }
  }

  @Transactional(readOnly = true)
  public boolean isClubFeatured(Long id) {

    Club club = clubRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다: " + id));

    return club.getFeatured();
  }

  public ResponseEntity<?> getFeaturedClubs() {
    try {
      List<Club> featuredList = clubRepository.findByFeatured(true);
      List<ClubDTO> featuredDTOList = featuredList.stream()
          .map(this::setClubDTO)
          .collect(Collectors.toList());
      return ResponseEntity.status(HttpStatus.OK).body(featuredDTOList);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  public ClubDTO setClubDTO(Club club) {
    ClubDTO dto = new ClubDTO();
    dto.setId(club.getId());
    dto.setTitle(club.getTitle());
    dto.setManagerId(club.getManagerId());
    dto.setDescription(club.getDescription());

    dto.setImageUrl(club.getImageUrl());
    dto.setDetailImages(club.getDetailImages());

    dto.setCategories(club.getCategories());
    dto.setUniversities(club.getUniversities());

    dto.setCreatedAt(club.getCreatedAt());
    dto.setUpdatedAt(club.getUpdatedAt());
    return dto;
  }

}