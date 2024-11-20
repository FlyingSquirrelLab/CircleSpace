package com.teame.config;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MailController {

  private final MailService mailService;

  @PostMapping("/api/register/sendEmail/{username}")
  public String emailCheck(@PathVariable String username) throws MessagingException {
    return mailService.sendSimpleMessage(username);
  }

}