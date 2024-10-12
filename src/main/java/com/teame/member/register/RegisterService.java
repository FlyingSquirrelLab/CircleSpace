package com.teame.member.register;


import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.teame.member.Member;
import com.teame.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Log4j2
@Service
@RequiredArgsConstructor
public class RegisterService {

  private final MemberRepository memberRepository;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;

  public ResponseEntity<String> phoneNumberCheck(String request) {

    JsonObject jsonObject = JsonParser.parseString(request).getAsJsonObject();
    String phoneNumber = jsonObject.get("phoneNumber").getAsString();
    phoneNumber = URLDecoder.decode(phoneNumber, StandardCharsets.UTF_8);

    if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("전화번호 전송 오류입니다.");
    }

    boolean exists = memberRepository.existsByPhoneNumber(phoneNumber.trim());

    if (exists) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 전화번호입니다.");
    } else {
      return ResponseEntity.status(HttpStatus.OK).body("사용가능한 전화번호입니다.");
    }
  }


  public ResponseEntity<String> usernameCheck(String request) {

    JsonObject jsonObject = JsonParser.parseString(request).getAsJsonObject();
    String username = jsonObject.get("username").getAsString();
    username = URLDecoder.decode(username, StandardCharsets.UTF_8);

    if (username == null || username.trim().isEmpty()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일 전송 오류입니다.");
    }

    boolean exists = memberRepository.existsByUsername(username.trim());

    if (exists) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 이메일입니다.");
    } else {
      return ResponseEntity.status(HttpStatus.OK).body("사용가능한 이메일입니다.");
    }
  }

  public ResponseEntity<String> displayNameCheck(String request) {

    JsonObject jsonObject = JsonParser.parseString(request).getAsJsonObject();
    String displayName = jsonObject.get("displayName").getAsString();

    displayName = URLDecoder.decode(displayName, StandardCharsets.UTF_8);

    if (displayName == null || displayName.trim().isEmpty()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("닉네임 전송 오류");
    }

    boolean exists = memberRepository.existsByDisplayName(displayName.trim());

    if (exists) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 닉네임입니다.");
    } else {
      return ResponseEntity.status(HttpStatus.OK).body("사용가능한 닉네임입니다.");
    }
  }

  public ResponseEntity<String> registerProc(RegisterDTO registerDTO) {
    try {
      Member member = new Member();
      member.setUsername(registerDTO.getUsername());
      member.setPassword(bCryptPasswordEncoder.encode(registerDTO.getPassword()));
      member.setDisplayName(registerDTO.getDisplayName());
      member.setRealName(registerDTO.getRealName());
      member.setPhoneNumber(registerDTO.getPhoneNumber());
      member.setAddress(registerDTO.getAddress());
      member.setDetailAddress(registerDTO.getDetailAddress());
      member.setPostCode(registerDTO.getPostCode());
      member.setRole("ROLE_USER");
      memberRepository.save(member);
      return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패" + e.getMessage());
    }
  }

}