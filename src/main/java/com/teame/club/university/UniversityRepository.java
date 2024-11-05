package com.teame.club.university;

import com.teame.club.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
  Optional<University> findByTitle(String title);
}
