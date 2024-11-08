package com.teame.promo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
public class Promo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="promo_title")
    private String promoTitle;

    @Column(name="promo_body", columnDefinition = "TEXT")
    private String promoBody;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // everytime에 포스트된 시각
    @Column(name="posted_at")
    private LocalDateTime postedAt;
}
