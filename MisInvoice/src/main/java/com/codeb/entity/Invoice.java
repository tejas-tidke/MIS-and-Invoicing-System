package com.codeb.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String invoiceNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", unique = true)
    private Estimate estimate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chain_id", nullable = false)
    private Chain chain;

    @Column(nullable = false)
    private String serviceDetails;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "cost_per_unit", nullable = false)
    private BigDecimal costPerUnit;

    @Column(name = "amount_payable", nullable = false)
    private BigDecimal amountPayable;

    private BigDecimal balance;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "service_date")
    private LocalDate serviceDate;

    @Column(name = "delivery_details", length = 100)
    private String deliveryDetails;

    @Column(name = "client_email", nullable = false)
    private String clientEmail;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @PrePersist
    public void prePersist() {
        if (this.invoiceNo == null) {
            this.invoiceNo = generateInvoiceNumber();
        }
        if (this.status == null) {
            this.status = InvoiceStatus.GENERATED;
        }
    }

    private String generateInvoiceNumber() {
        return "INV-" +
                LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) +
                "-" + String.format("%03d", ThreadLocalRandom.current().nextInt(1, 1000));
    }

    public enum InvoiceStatus {
        GENERATED, SENT, PAID, CANCELLED
    }
}