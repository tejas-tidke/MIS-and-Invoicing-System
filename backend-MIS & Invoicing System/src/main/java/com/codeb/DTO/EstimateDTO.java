package com.codeb.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstimateDTO {
    private Long estimateId;
    private Long chainId;
    private String groupName;
    private String brandName;
    private String zoneName;
    private String service;
    private int qty;
    private BigDecimal costPerUnit;
    private BigDecimal totalCost;
    private LocalDate deliveryDate;
    private String deliveryDetails;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}