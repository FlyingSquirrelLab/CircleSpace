package com.teame.club;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
public class ClubController {

  private final ClubRepository clubRepository;

  @GetMapping("/api/club/detail/{id}")
  public ResponseEntity<?> getClubDetail(@PathVariable Long id) {
    Club club = clubRepository.getById(id);
    log.info(club);
    return ResponseEntity.status(HttpStatus.OK).body(club);
  }


}
