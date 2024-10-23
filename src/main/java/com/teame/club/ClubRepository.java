package com.teame.club;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club, Long> {

  Club getById(Long id);

  Optional<Club> findByTitle(String title);

  List<Club> findByFeatured(Boolean featured);

}
