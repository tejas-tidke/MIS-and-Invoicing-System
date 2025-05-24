package com.codeb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BrandRequest {

    @NotBlank(message = "Brand name cannot be empty") // Ensure brand name is not blank
    private String brandName; // Brand name

    @NotNull(message = "Chain ID cannot be null") // Ensure chain ID is not null
    private Long chainId; // Chain ID to link the brand
    
    
}