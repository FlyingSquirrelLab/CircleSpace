package com.teame.club.admin;

import com.teame.member.Member;
import com.teame.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Log4j2
@RestController
@RequiredArgsConstructor
public class MemberManageController {

  private final MemberRepository memberRepository;

  // 회원 정보 리스트
  @GetMapping("/api/admin/fetchMemberList/{page}/{size}")
  public ResponseEntity<?> fetchMemberListAPI(@PathVariable int page,
                                              @PathVariable int size,
                                              PagedResourcesAssembler<MemberManageDTO> assembler) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<MemberManageDTO> memberDTOPage = memberRepository.findAll(pageable)
        .map(member -> new MemberManageDTO(
            member.getId(),
            member.getUsername(),
            member.getDisplayName(),
            member.getRealName(),
            member.getCreatedAt()
        ));
    PagedModel<EntityModel<MemberManageDTO>> pagedModel = assembler.toModel(memberDTOPage);
    return ResponseEntity.ok(pagedModel);
  }

  // 회원 정보 디테일
  @GetMapping("/api/admin/fetchMemberDetail/{id}")
  public ResponseEntity<?> fetchMemberDetailAPI(@PathVariable Long id) {
    Optional<Member> member = memberRepository.findById(id);
    if (member.isPresent()) {
      return ResponseEntity.status(HttpStatus.OK).body(member.get());
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");
    }
  }

}
