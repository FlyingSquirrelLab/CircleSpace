package com.teame.club.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

  List<Review> getAllByClubId(Long ClubId);

  List<Review> getAllByUsername(String username);
}
