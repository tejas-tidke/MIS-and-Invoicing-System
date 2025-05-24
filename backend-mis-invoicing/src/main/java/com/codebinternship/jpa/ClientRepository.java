package com.codebinternship.jpa;


import org.springframework.data.jpa.repository.JpaRepository;

import com.codebinternship.entity.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
 
}
