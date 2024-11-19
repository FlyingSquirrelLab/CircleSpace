package com.teame.config;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MailController {

  private final MailService mailService;

  @PostMapping("/api/emailCheck")
  public String emailCheck(@RequestBody MailDTO mailDTO) throws MessagingException {
    String authCode = mailService.sendSimpleMessage(mailDTO.getEmail());
    return authCode;
  }

}