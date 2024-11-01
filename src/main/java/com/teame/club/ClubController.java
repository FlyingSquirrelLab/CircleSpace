package com.teame.club;

import com.teame.club.category.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ClubController {

  private final ClubRepository clubRepository;
  private final ClubService clubService;
  private final CategoryService categoryService;

  @PutMapping("/api/club/edit/{id}")
  public ResponseEntity<String> editClubProcAPI(@PathVariable Long id,
                                                @RequestBody Map<String, Object> request) {
    return clubService.editClubProc(id, request);
  }

  @DeleteMapping("/api/club/delete/{id}")
  public ResponseEntity<String> deleteClubAPI(@PathVariable Long id) {
    return clubService.deleteClub(id);
  }

  @GetMapping("/api/club/fetchAll")
  public List<ClubDTO> fetchAllClubs() {
    List<Club> clubs = clubRepository.findAll();
    return clubs.stream()
        .map(clubService::setClubDTO)
        .collect(Collectors.toList());
  }

  @GetMapping("/api/club/getByCategory/{category}/{page}/{size}")
  public ResponseEntity<?> getItemsByCategoryAPI(@PathVariable String category,
                                                 @PathVariable int page,
                                                 @PathVariable int size,
                                                 PagedResourcesAssembler<Club> assembler) {
    return categoryService.getClubsByCategory(category, page, size, assembler);
  }

  @GetMapping("/api/club/getById/{id}")
  public ResponseEntity<?> getByIdAPI(@PathVariable Long id) {
    return clubService.getById(id);
  }

  @PostMapping("/api/club/upload")
  public ResponseEntity<String> uploadClubAPI(@RequestBody Map<String, Object> request) {
    return clubService.uploadClub(request);
  }

  @GetMapping("/api/club/checkFeatured/{id}")
  public ResponseEntity<Map<String, Boolean>> checkFeatured(@PathVariable Long id) {
    boolean featured = clubService.isClubFeatured(id);
    Map<String, Boolean> response = new HashMap<>();
    response.put("featured", featured);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/api/club/getFeatured")
  public ResponseEntity<?> getFeaturedClubsAPI() {
    return clubService.getFeaturedClubs();
  }

}