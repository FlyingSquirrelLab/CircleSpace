//package com.teame.member.register;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@Log4j2
//@RestController
//@RequiredArgsConstructor
//public class RegisterController {
//
//  private final RegisterService registerService;
//
//  @PostMapping("/api/register/phoneNumberCheck")
//  public ResponseEntity<String> phoneNumberCheckAPI(@RequestBody String request) {
//    return registerService.phoneNumberCheck(request);
//  }
//
//  @PostMapping("/api/register/usernameCheck")
//  public ResponseEntity<String> usernameCheckAPI(@RequestBody String request) {
//    return registerService.usernameCheck(request);
//  }
//
//  @PostMapping("/api/register/displayNameCheck")
//  public ResponseEntity<String> displayNameCheckAPI(@RequestBody String request) {
//    return registerService.displayNameCheck(request);
//  }
//
//  @PostMapping("/api/register/registerProc")
//  public ResponseEntity<String> registerProcAPI(@RequestBody RegisterDTO registerDTO) {
//    return registerService.registerProc(registerDTO);
//  }
//
//}