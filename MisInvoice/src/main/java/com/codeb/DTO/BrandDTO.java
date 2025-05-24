package com.codeb.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class BrandDTO {
    private Long id;
    private String brandName;
    private ChainSimpleDTO chain;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
