package com.codebinternship.jpa;


import org.springframework.data.jpa.repository.JpaRepository;

import com.codebinternship.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
 
}
