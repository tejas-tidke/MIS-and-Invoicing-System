package com.codeb.DTO;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class InvoiceRequest {
    
    @NotNull(message = "Estimate ID is required")
    private Long estimateId;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String clientEmail;
    
    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be positive")
    private BigDecimal amountPaid;
    
    @NotNull(message = "Payment date is required")
    private LocalDateTime paymentDate;
}