package com.teame.club.comment;

import com.teame.club.Club;
import com.teame.club.category.Category;
import com.teame.member.MemberRepository;
import com.teame.member.customUser.CustomUserDetails;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;
  private final MemberRepository memberRepository;
  private final QnARepository qnARepository;

  @PostMapping("/api/review/add")
  public ResponseEntity<String> addReviewAPI(@RequestBody Map<String, Object> request,
                                             Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    String displayName = (memberRepository.findByUsername(username)).getDisplayName();
    return commentService.addReview(request, username, displayName);
  }

  @GetMapping("/api/review/fetchByClubId/{clubId}")
  public ResponseEntity<?> fetchReviewByClubIdAPI(@PathVariable Long clubId) {
    return commentService.fetchReviewByClubId(clubId);
  }

  @GetMapping("/api/review/fetchByMember")
  public ResponseEntity<?> fetchReviewByMemberAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.fetchReviewByMember(username);
  }

  @DeleteMapping("/api/review/deleteById/{reviewId}")
  public ResponseEntity<String> deleteReviewByIdAPI(@PathVariable Long reviewId) {
    return commentService.deleteReview(reviewId);
  }

  @PostMapping("/api/qna/add")
  public ResponseEntity<String> addQnAAPI(@RequestBody Map<String, Object> request,
                                          Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    String displayName = (memberRepository.findByUsername(username)).getDisplayName();
    return commentService.addQnA(request, username, displayName);
  }

  @GetMapping("/api/qna/fetchAll/{page}/{size}")
  public ResponseEntity<?> fetchQnAAPI(@PathVariable int page,
                                       @PathVariable int size,
                                       PagedResourcesAssembler<QnA> assembler) {
    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
      Page<QnA> qnaPage = qnARepository.findAll(pageable);
      PagedModel<EntityModel<QnA>> pagedModel = assembler.toModel(qnaPage);
      return ResponseEntity.status(HttpStatus.OK).body(pagedModel);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("QnA 불러오기 실패: " + e.getMessage());
    }
  }

  @GetMapping("/api/qna/fetchById/{qnaId}")
  public ResponseEntity<?> fetchQnAByIdAPI(@PathVariable Long qnaId) {
    return commentService.fetchQnAById(qnaId);
  }

  @GetMapping("/api/qna/fetchByMember")
  public ResponseEntity<?> fetchQnAByMemberAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.fetchQnAByMember(username);
  }

  @DeleteMapping("/api/qna/deleteById/{qnaId}")
  public ResponseEntity<String> deleteQnAByIdAPI(@PathVariable Long qnaId,
                                                 Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.deleteQnA(qnaId, username);
  }

  @PostMapping("/api/reply/add")
  public ResponseEntity<Reply> addReplyAPI(@RequestBody Map<String, Object> request,
                                           Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    String displayName = (memberRepository.findByUsername(username)).getDisplayName();
    return commentService.addReply(request, username, displayName);
  }

  @GetMapping("/api/reply/fetchByQnAId/{qnaId}")
  public ResponseEntity<?> fetchReplyByQnAIdAPI(@PathVariable Long qnaId) {
    return commentService.fetchReplyByParent(qnaId);
  }

  @GetMapping("/api/reply/fetchByMember")
  public ResponseEntity<?> fetchReplyByMemberAPI(Authentication auth) {
    String username = ((CustomUserDetails) auth.getPrincipal()).getUsername();
    return commentService.fetchReplyByMember(username);
  }

  @DeleteMapping("/api/reply/deleteById/{replyId}")
  public ResponseEntity<String> deleteReplyAPI(@PathVariable Long replyId) {
    return commentService.deleteReply(replyId);
  }

}
