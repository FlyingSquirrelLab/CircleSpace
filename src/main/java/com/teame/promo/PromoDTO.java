package com.teame.promo;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PromoDTO {
    private Long id;
    private String title;
    private String body;
    private LocalDateTime createdAt;
    private LocalDateTime postedAt;
}
