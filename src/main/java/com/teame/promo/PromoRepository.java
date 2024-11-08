package com.teame.promo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PromoRepository extends JpaRepository<Promo, Long> {

//    @Query("DELETE FROM JsonData j WHERE j.history.id = :historyId")

    // 입력한 날짜에 대한 데이터 조회
//    @Query("SELECT p FROM Promo p WHERE YEAR(p.postedAt) = :year AND MONTH(p.postedAt) = :month AND DAY(p.postedAt) = :day")
//    List<Promo> findByPostedAt(@Param("year") int year, @Param("month") int month, @Param("day") int day);

    @Query("SELECT COUNT(p) > 0 FROM Promo p WHERE YEAR(p.postedAt) = :year AND MONTH(p.postedAt) = :month AND DAY(p.postedAt) = :day AND p.promoTitle = :title")
    boolean existsByDateAndTitle(@Param("year") int year, @Param("month") int month, @Param("day") int day, @Param("title") String title);


}
