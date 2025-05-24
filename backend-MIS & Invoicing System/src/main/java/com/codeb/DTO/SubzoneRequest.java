package com.codeb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubzoneRequest {
    @NotBlank(message = "Zone name cannot be empty")
    private String name;
    
    @NotNull(message = "Brand ID cannot be null")
    private Long brandId;
}