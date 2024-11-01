package com.teame.club;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club, Long>, JpaSpecificationExecutor<Club> {

  Optional<Club> findByTitle(String title);

  List<Club> findByFeatured(Boolean featured);

}
