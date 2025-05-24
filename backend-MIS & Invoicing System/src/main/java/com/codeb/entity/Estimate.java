package com.codeb.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Estimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chain_id", nullable = false)
    @JsonIgnoreProperties({"brands", "group"})
    private Chain chain;

    @Column(name = "group_name", length = 50)
    private String groupName;

    @Column(name = "brand_name", length = 50)
    private String brandName;

    @Column(name = "zone_name", length = 50)
    private String zoneName;

    @NotBlank(message = "Service description is required")
    @Size(max = 100, message = "Service description cannot exceed 100 characters")
    private String service;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int qty;

    @NotNull(message = "Cost per unit is required")
    @Column(name = "cost_per_unit")
    private BigDecimal costPerUnit;

    @NotNull(message = "Total cost is required")
    @Column(name = "total_cost")
    private BigDecimal totalCost;

    @NotNull(message = "Delivery date is required")
    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Size(max = 100, message = "Delivery details cannot exceed 100 characters")
    @Column(name = "delivery_details")
    private String deliveryDetails;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @PrePersist
    @PreUpdate
    private void calculateAndSetDetails() {

        this.totalCost = this.costPerUnit.multiply(BigDecimal.valueOf(this.qty));


        if (this.chain != null) {
            if (this.chain.getGroup() != null) {
                this.groupName = this.chain.getGroup().getName();
            }
        }
    }
}