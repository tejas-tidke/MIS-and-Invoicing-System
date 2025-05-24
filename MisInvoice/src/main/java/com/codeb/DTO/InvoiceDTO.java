package com.codeb.DTO;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.codeb.entity.Invoice.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {
    private Long id;
    private String invoiceNo;
    private Long estimateId;
    private String chainName;
    private String gstn;
    private String serviceDetails;
    private int quantity;
    private BigDecimal costPerUnit;
    private BigDecimal amountPayable;
    private BigDecimal balance;
    private LocalDateTime paymentDate;
    private LocalDate serviceDate;
    private String deliveryDetails;
    private String clientEmail;
    private InvoiceStatus status;
    private LocalDateTime createdAt;
}