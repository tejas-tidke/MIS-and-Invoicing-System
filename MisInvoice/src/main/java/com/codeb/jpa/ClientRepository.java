package com.codeb.jpa;


import org.springframework.data.jpa.repository.JpaRepository;

import com.codeb.entity.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
 
}
