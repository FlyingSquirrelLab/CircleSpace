package com.teame.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class S3Controller {

  private final S3Service s3Service;

  @PostMapping("/api/s3/getPreSignedUrl")
  public ResponseEntity<Map<String, String>> getPreSignedUrl(@RequestBody Map<String, String> request) {
    try {
      String path = request.get("path");
      String preSignedUrl = s3Service.createPreSignedUrl(path);
      Map<String, String> response = new HashMap<>();
      response.put("url", preSignedUrl);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}