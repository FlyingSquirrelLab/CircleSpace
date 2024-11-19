package com.teame.promo;

import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class PromoScheduler {
    private final PromoDataParser promoDataParser;

    public PromoScheduler(PromoDataParser promoDataParser) {
        this.promoDataParser = promoDataParser;
    }

    @Scheduled(cron = "0 0 3 * * ?", zone = "Asia/Seoul")
    public void scheduledTask() {
        int result = promoDataParser.runSeleniumTask();
        log.info("Scheduled task completed. Parsed articles: " + result);
    }
}
