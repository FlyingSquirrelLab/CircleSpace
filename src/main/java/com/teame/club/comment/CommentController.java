package com.teame.club.comment;

import com.teame.member.MemberRepository;
import com.teame.member.customUser.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;
  private final MemberRepository memberRepository;

  // REVIEW
  @PostMapping("/api/comment/addReview")
  public ResponseEntity<String> addReviewAPI(@RequestBody Map<String, Object> request,
                                             Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    String displayName = (memberRepository.findByUsername(username)).getDisplayName();
    return commentService.addReview(request, username, displayName);
  }

  @GetMapping("/api/comment/review/{clubId}")
  public ResponseEntity<?> fetchReviewByClubAPI(@PathVariable Long clubId) {
    return commentService.fetchReviewByClubId(clubId);
  }

  @GetMapping("/api/comment/member/review")
  public ResponseEntity<?> fetchReviewByMemberAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.fetchReviewByMember(username);
  }

  @DeleteMapping("/api/comment/deleteReview/{reviewId}")
  public ResponseEntity<String> deleteReviewAPI(@PathVariable Long reviewId) {
    return commentService.deleteReview(reviewId);
  }

  @PostMapping("/api/comment/addQnA")
  public ResponseEntity<String> addQnAAPI(@RequestBody Map<String, Object> request,
                                          Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    String displayName = (memberRepository.findByUsername(username)).getDisplayName();
    return commentService.addQnA(request, username, displayName);
  }

  @GetMapping("/api/comment/allQnA")
  public ResponseEntity<?> fetchQnAAPI() {
    return commentService.fetchAllQnA();
  }

  @GetMapping("/api/comment/qna/{qnaId}")
  public ResponseEntity<?> fetchQnAByIdAPI(@PathVariable Long qnaId) {
    return commentService.fetchQnAById(qnaId);
  }

  @GetMapping("/api/comment/member/qna")
  public ResponseEntity<?> fetchQnAByMemberAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.fetchQnAByMember(username);
  }

  @DeleteMapping("/api/comment/deleteQnA/{qnaId}")
  public ResponseEntity<String> deleteQnAAPI(@PathVariable Long qnaId,
                                             Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.deleteQnA(qnaId, username);
  }

  // REPLY
  @PostMapping("/api/comment/addReply")
  public ResponseEntity<Reply> addReplyAPI(@RequestBody Map<String, Object> request,
                                            Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    String displayName = (memberRepository.findByUsername(username)).getDisplayName();
    return commentService.addReply(request, username, displayName);
  }

  @GetMapping("/api/comment/reply/{qnaId}")
  public ResponseEntity<?> fetchReplyByParentAPI(@PathVariable Long qnaId) {
    return commentService.fetchReplyByParent(qnaId);
  }

  @GetMapping("/api/comment/member/reply")
  public ResponseEntity<?> fetchReplyByMemberAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.fetchReplyByMember(username);
  }

  @DeleteMapping("/api/comment/deleteReply/{replyId}")
  public ResponseEntity<String> deleteReplyAPI(@PathVariable Long replyId) {
    return commentService.deleteReply(replyId);
  }

}
