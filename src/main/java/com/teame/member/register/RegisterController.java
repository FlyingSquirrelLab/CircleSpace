package com.teame.member.register;

import com.teame.club.university.University;
import com.teame.club.university.UniversityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RegisterController {

  private final RegisterService registerService;
  private final UniversityRepository universityRepository;

  @PostMapping("/api/register/phoneNumberCheck")
  public ResponseEntity<String> phoneNumberCheckAPI(@RequestBody String request) {
    return registerService.phoneNumberCheck(request);
  }

  @PostMapping("/api/register/usernameCheck")
  public ResponseEntity<String> usernameCheckAPI(@RequestBody String request) {
    return registerService.usernameCheck(request);
  }

  @PostMapping("/api/register/displayNameCheck")
  public ResponseEntity<String> displayNameCheckAPI(@RequestBody String request) {
    return registerService.displayNameCheck(request);
  }

  @GetMapping("/api/register/universityCheck/{username}")
  public ResponseEntity<String> universityCheckAPI(@PathVariable String username) {
    String domain = username.substring(username.indexOf('@') + 1);

    Optional<University> universityOpt = universityRepository.findByCode(domain);

    if (universityOpt.isPresent()) {
      String universityName = universityOpt.get().getTitle();
      return ResponseEntity.status(HttpStatus.OK).body(universityName + " 소속으로 확인되었습니다.");
    } else {
      return ResponseEntity.status(HttpStatus.OK).body("해당 이메일 도메인으로는 소속대학을 확인할 수 없습니다.");
    }
  }

  @PostMapping("/api/register/registerProc")
  public ResponseEntity<String> registerProcAPI(@RequestBody Map<String, Object> request) {
    return registerService.registerProc(request);
  }

}