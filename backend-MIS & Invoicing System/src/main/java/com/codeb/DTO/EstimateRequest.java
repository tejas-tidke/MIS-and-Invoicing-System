package com.codeb.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstimateRequest {
    
    @NotNull(message = "Chain ID is required")
    private Long chainId;
    
    private String brandName;
    
    private String zoneName;
    
    @NotBlank(message = "Service description is required")
    @Size(max = 100, message = "Service description cannot exceed 100 characters")
    private String service;
    
    @Min(value = 1, message = "Quantity must be at least 1")
    private int qty;
    
    @NotNull(message = "Cost per unit is required")
    private BigDecimal costPerUnit;
    
    @NotNull(message = "Delivery date is required")
    private LocalDate deliveryDate;
    
    @Size(max = 100, message = "Delivery details cannot exceed 100 characters")
    private String deliveryDetails;
}