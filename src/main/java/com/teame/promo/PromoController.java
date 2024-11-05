package com.teame.promo;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@Log4j2
@RestController
public class PromoController {

    private final PromoService promoService;

    @Autowired
    public PromoController(PromoService promoService){
        this.promoService = promoService;
    }

    @GetMapping("/api/parse")
    public ResponseEntity<?> fetchParseData()
    {
        log.info("111");
        try {
            log.info("start parse");
            promoService.initializeDriver();
            promoService.runSeleniumTask();
            return ResponseEntity.ok("");
        } catch (Exception e) {
            log.info("fail parse");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
