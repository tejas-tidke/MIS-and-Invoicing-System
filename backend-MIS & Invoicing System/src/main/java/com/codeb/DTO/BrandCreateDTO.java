package com.codeb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BrandCreateDTO {
    @NotBlank
    private String brandName;
    
    @NotNull
    private Long chainId;
  
}