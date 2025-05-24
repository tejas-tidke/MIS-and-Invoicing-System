package com.codeb.jpa;


import org.springframework.data.jpa.repository.JpaRepository;

import com.codeb.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
 
}
