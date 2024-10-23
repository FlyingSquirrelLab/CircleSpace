package com.teame.club.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {

  List<Reply> getAllByParentId(Long parentId);

  List<Reply> getAllByUsername(String username);
}
