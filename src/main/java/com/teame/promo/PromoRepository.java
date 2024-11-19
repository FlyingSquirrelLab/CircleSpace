package com.teame.promo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PromoRepository extends JpaRepository<Promo, Long> {
    // 테이블에서 동일한 제목의 글이 있는지 확인.
    @Query("SELECT COUNT(p) > 0 FROM Promo p WHERE p.title = :title AND p.body = :body")
    boolean existsByTitleANDBody(@Param("title") String title, @Param("body") String body);


    // 테이블에 정확히 동일한 값이 있는지 확인
    @Query("SELECT COUNT(p) > 0 FROM Promo p WHERE p.title = :title AND YEAR(p.postedAt) = :year AND MONTH(p.postedAt) = :month AND DAY(p.postedAt) = :day")
    boolean existsByTitleAndDate(@Param("title") String title, @Param("year") int year, @Param("month") int month, @Param("day") int day);

}
