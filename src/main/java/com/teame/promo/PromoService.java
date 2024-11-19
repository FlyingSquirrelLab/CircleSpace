package com.teame.promo;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class PromoService {
  private final PromoRepository promoRepository;

  @Autowired
  public PromoService(PromoRepository promoRepository) {
      this.promoRepository = promoRepository;
  }

  public PromoDTO setPromoDTO(Promo promo) {
    PromoDTO dto = new PromoDTO();
    dto.setId(promo.getId());
    dto.setTitle(promo.getTitle());
    dto.setBody(promo.getBody());
    dto.setCreatedAt(promo.getCreatedAt());
    dto.setPostedAt(promo.getPostedAt());
    return dto;
  }

  public ResponseEntity<?> fetchPromoById(Long promoId) {
    return ResponseEntity.status(HttpStatus.OK).body(promoRepository.findById(promoId));
  }
}
