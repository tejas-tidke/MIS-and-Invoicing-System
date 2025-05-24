package com.codeb.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chainId;

    private String companyName;

    @Column(unique = true)
    private String gstnNo;

    private boolean isActive = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    @JsonManagedReference
    private Group group;

    @OneToMany(mappedBy = "chain")
    @JsonIgnore
    private List<Brand> brands;

    @OneToMany(mappedBy = "chain")
    @JsonIgnore
    private List<Estimate> estimates;

    @OneToMany(mappedBy = "chain")
    @JsonIgnore
    private List<Invoice> invoices;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}