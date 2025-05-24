package com.codeb.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.codeb.entity.Chain;
import com.codeb.entity.Group;

public interface ChainRepository extends JpaRepository<Chain, Long> {
    List<Chain> findByGroup(Group group);

    boolean existsByGstnNo(String gstnNo);
    @Query("SELECT c FROM Chain c JOIN FETCH c.group")
    List<Chain> findAllWithGroup();

}