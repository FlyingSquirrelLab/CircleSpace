package com.teame.club.category;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class CategoryId {
  Long id;
}
