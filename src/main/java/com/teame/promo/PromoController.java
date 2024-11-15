package com.teame.promo;

import com.teame.club.Club;
import com.teame.club.ClubDTO;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@RestController
public class PromoController {

    private final PromoService promoService;
    private final PromoRepository promoRepository;
    private final PromoDataParser promoDataParser;

    @Autowired
    public PromoController(PromoService promoService, PromoRepository promoRepository, PromoDataParser promoDataParser){
        this.promoService = promoService;
        this.promoRepository = promoRepository;
        this.promoDataParser = promoDataParser;
    }

    @GetMapping("/api/daily-up/fetchAll")
    public List<PromoDTO> fetchAllPromos() {
        List<Promo> promos = promoRepository.findAll();
        return promos.stream()
                .map(promoService::setPromoDTO)
                .collect(Collectors.toList());
    }
    @GetMapping("/api/daily-up/fetchById/{promoId}")
    public ResponseEntity<?> fetchPromoByIdAPI(@PathVariable Long promoId) {
        return promoService.fetchPromoById(promoId);
    }



    // Manual로 데이터 파싱 수행
    @GetMapping("/api/parse")
    public ResponseEntity<?> fetchParseData()
    {
        try {
            promoDataParser.runSeleniumTask();
            return ResponseEntity.ok("");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
