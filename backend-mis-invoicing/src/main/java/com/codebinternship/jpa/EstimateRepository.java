package com.codebinternship.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codebinternship.entity.Estimate;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, Long> {

    List<Estimate> findByChainChainId(Long chainId);

    List<Estimate> findByChainGroupId(Long groupId);

    List<Estimate> findByChainGroupNameContainingIgnoreCase(String groupName);

    List<Estimate> findByBrandNameContainingIgnoreCase(String brandName);
}