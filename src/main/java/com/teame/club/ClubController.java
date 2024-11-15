package com.teame.club;

import com.teame.club.category.CategoryService;
import com.teame.member.customUser.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import retrofit2.http.Path;

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

  @PutMapping("/api/club/edit/{clubId}")
  public ResponseEntity<String> editClubProcAPI(@PathVariable Long clubId,
                                                @RequestBody Map<String, Object> request) {
    return clubService.editClubProc(request, clubId);
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

  @GetMapping("/api/club/getByCategory/{category}/{order}/{page}/{size}")
  public ResponseEntity<?> getClubsByCategoryAPI(@PathVariable String category,
                                                 @PathVariable String order,
                                                 @PathVariable int page,
                                                 @PathVariable int size,
                                                 PagedResourcesAssembler<Club> assembler) {
    return categoryService.getClubsByCategory(category, order, page, size, assembler);
  }

  @GetMapping("/api/club/getByCategoryAndUsername/{category}/{username}/{order}/{page}/{size}")
  public ResponseEntity<?> getClubsByCategoryAndUsernameAPI(@PathVariable String category,
                                                              @PathVariable String username,
                                                              @PathVariable String order,
                                                              @PathVariable int page,
                                                              @PathVariable int size,
                                                              PagedResourcesAssembler<Club> assembler) {
    return categoryService.getClubsByCategoryAndUsername(category, username, order, page, size, assembler);
  }


  @GetMapping("/api/club/getById/{id}")
  public ResponseEntity<?> getByIdAPI(@PathVariable Long id) {
    return clubService.getById(id);
  }

  @PostMapping("/api/club/upload")
  public ResponseEntity<String> uploadClubAPI(@RequestBody Map<String, Object> request,
                                              Authentication auth) {
    Long id = ((CustomUserDetails) auth.getPrincipal()).getMember().getId();
    return clubService.uploadClub(request, id);
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

  @GetMapping("/api/club/getApplications/{id}")
  public ResponseEntity<?> getApplicationsAPI(@PathVariable Long id) {
    return clubService.getApplications(id);
  }

  @GetMapping("/api/club/getClubMembers/{id}")
  public ResponseEntity<?> getClubMembersAPI(@PathVariable Long id) {
    return clubService.getClubMembers(id);
  }

  @PutMapping("/api/club/approve")
  public ResponseEntity<?> approveMemberAPI(@RequestBody Map<String, Object> request) {
    return clubService.approveMember(request);
  }

  @DeleteMapping("/api/club/deny")
  public ResponseEntity<?> denyMemberAPI(@RequestBody Map<String, Object> request) {
    return clubService.denyMember(request);
  }

}