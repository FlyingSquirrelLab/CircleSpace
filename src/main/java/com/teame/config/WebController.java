package com.teamE.config;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// 리액트 새로고침시 라우터 오류 핸들러

@Controller
public class WebController implements ErrorController {
  @GetMapping({"/", "/error"})
  public String index() {
    return "forward:/index.html";
  }

}
