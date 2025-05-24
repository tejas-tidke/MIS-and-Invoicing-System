package com.codeb.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubzoneDTO {
    private Long id;
    private String name;
    private BrandDTO brand;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}