package com.codebinternship.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.codebinternship.entity.Chain;
import com.codebinternship.entity.Group;

public interface ChainRepository extends JpaRepository<Chain, Long> {
    List<Chain> findByGroup(Group group);

    boolean existsByGstnNo(String gstnNo);
    @Query("SELECT c FROM Chain c JOIN FETCH c.group")
    List<Chain> findAllWithGroup();

}