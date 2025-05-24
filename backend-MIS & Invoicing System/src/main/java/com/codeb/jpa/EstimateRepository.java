package com.codeb.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeb.entity.Estimate;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, Long> {

    List<Estimate> findByChainChainId(Long chainId);

    List<Estimate> findByChainGroupId(Long groupId);

    List<Estimate> findByChainGroupNameContainingIgnoreCase(String groupName);

    List<Estimate> findByBrandNameContainingIgnoreCase(String brandName);
}