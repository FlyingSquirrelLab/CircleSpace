package com.teamE.member.register;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TokenBlacklistService {

  private Set<String> blacklist = new HashSet<>();

  public void addTokenToBlacklist(String token) {
    blacklist.add(token);
  }

}
