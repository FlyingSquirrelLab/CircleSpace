package com.teame.club.comment;

import com.teame.s3.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class CommentService {

  private final ReviewRepository reviewRepository;
  private final QnARepository qnaRepository;
  private final ReplyRepository replyRepository;
  private final S3Service s3Service;

  public ResponseEntity<String> addReview(Map<String, Object> request, String username, String displayName) {

    try {
      Long clubId = Long.parseLong((String) request.get("clubId"));
      String content = (String) request.get("reviewContent");
      String imageUrl = s3Service.getObjectUrl((String) request.get("imagePath"));

      Review review = Review.builder()
          .content(content)
          .imageUrl(imageUrl)
          .clubId(clubId)
          .username(username)
          .displayName(displayName)
          .build();
      reviewRepository.save(review);
      return ResponseEntity.status(HttpStatus.OK).body("리뷰 업로드 완료");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("리뷰 업로드 실패" + e.getMessage());
    }
  }

  public ResponseEntity<String> deleteReview(Long reviewId) {
    Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
    if (reviewOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("리뷰가 존재하지 않습니다");
    }
    Review review = reviewOptional.get();
    reviewRepository.deleteById(review.getId());
    return ResponseEntity.status(HttpStatus.OK).body("리뷰 삭제 완료");
  }

  public ResponseEntity<String> addQnA(Map<String, Object> request, String username, String displayName) {
    try {
      QnA qna = new QnA();

      String qnaTitle = (String) request.get("qnaTitle");
      String content = (String) request.get("content");
      String imageUrl = s3Service.getObjectUrl((String) request.get("imagePath"));

      qna.setQnaTitle(qnaTitle);
      qna.setContent(content);
      qna.setImageUrl(imageUrl);
      qna.setUsername(username);
      qna.setDisplayName(displayName);
      qnaRepository.save(qna);

      return ResponseEntity.status(HttpStatus.OK).body("QnA 업로드 완료");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("QnA 업로드 실패");
    }
  }

  public ResponseEntity<String> deleteQnA(Long qnaId, String username) {
    Optional<QnA> qnaOptional = qnaRepository.findById(qnaId);
    if (qnaOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("QnA가 존재하지 않습니다");
    }
    QnA qna = qnaOptional.get();

    if (!Objects.equals(qna.getUsername(), username)) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("작성자가 불일치합니다.");
    }

    qnaRepository.deleteById(qna.getId());
    return ResponseEntity.status(HttpStatus.OK).body("QnA 삭제 완료");
  }

  public ResponseEntity<Reply> addReply(Map<String, Object> request, String username, String displayName) {
    try {
      Reply reply = new Reply();
      String content = (String) request.get("replyContent");
      Long parentId = Long.parseLong((String) request.get("parentId"));

      reply.setContent(content);
      reply.setParentId(parentId);
      reply.setUsername(username);
      reply.setDisplayName(displayName);
      replyRepository.save(reply);
      return ResponseEntity.status(HttpStatus.OK).body(reply);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  public ResponseEntity<String> deleteReply(Long replyId) {
    Optional<Reply> replyOptional = replyRepository.findById(replyId);
    if (replyOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("댓글이 존재하지 않습니다");
    }
    Reply reply = replyOptional.get();
    replyRepository.deleteById(reply.getId());
    return ResponseEntity.status(HttpStatus.OK).body("댓글 삭제 완료");
  }

  public ResponseEntity<?> fetchReviewByClubId(Long clubId) {
    List<Review> reviewList = reviewRepository.getAllByClubId(clubId);
    return ResponseEntity.status(HttpStatus.OK).body(reviewList);
  }

  public ResponseEntity<?> fetchReviewByMember(String username) {
    List<Review> reviewList = reviewRepository.getAllByUsername(username);
    return ResponseEntity.status(HttpStatus.OK).body(reviewList);
  }

  public ResponseEntity<?> fetchQnAById(Long qnaId) {
    return ResponseEntity.status(HttpStatus.OK).body(qnaRepository.findById(qnaId));
  }

  public ResponseEntity<?> fetchQnAByMember(String username) {
    List<QnA> qnaList = qnaRepository.getAllByUsername(username);
    return ResponseEntity.status(HttpStatus.OK).body(qnaList);
  }

  public ResponseEntity<?> fetchReplyByParent(Long parentId) {
    List<Reply> replyList = replyRepository.getAllByParentId(parentId);
    return ResponseEntity.status(HttpStatus.OK).body(replyList);
  }

  public ResponseEntity<?> fetchReplyByMember(String username) {
    List<Reply> replyList = replyRepository.getAllByUsername(username);
    return ResponseEntity.status(HttpStatus.OK).body(replyList);
  }

}
