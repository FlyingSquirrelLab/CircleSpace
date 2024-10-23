package com.teame.club.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QnARepository extends JpaRepository<QnA, Long> {

  List<QnA> getAllByUsername(String username);
}
