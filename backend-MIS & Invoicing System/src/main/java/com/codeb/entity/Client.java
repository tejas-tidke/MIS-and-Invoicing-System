package com.codeb.entity;


import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor 
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String organizationDetails;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @JsonIgnore
    private Group group;

    @ManyToOne
    @JoinColumn(name = "chain_id")
    @JsonIgnore
    private Chain chain;

    @ManyToOne
    @JoinColumn(name = "subzone_id")
    @JsonIgnore
    private Subzone subzone;



//    @OneToMany(mappedBy = "client")
//    private Set<Invoice> invoices;

   
}