package com.teame.club.like;

import com.teame.member.customUser.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LikeController {

  private final LikeService likeService;

  @GetMapping("/api/like/check/{clubId}")
  public ResponseEntity<Map<String, Boolean>> checkLike(@PathVariable Long clubId,
                                                        Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    boolean liked = likeService.isClubLikedByMember(username, clubId);
    Map<String, Boolean> response = new HashMap<>();
    response.put("liked", liked);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/api/like/fetch")
  public ResponseEntity<List<FetchLikeDTO>> fetchLike(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    List<FetchLikeDTO> like = likeService.fetchLike(username);
    return ResponseEntity.ok(like);
  }

  @PostMapping("/api/like/add/{title}")
  public ResponseEntity<String> addToLike(@PathVariable String title,
                                          Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return likeService.addToLike(username, title);
  }

  @DeleteMapping("/api/like/delete/{title}")
  public ResponseEntity<String> deleteFromLike(@PathVariable String title,
                                               Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return likeService.deleteFromLike(username, title);
  }

}
