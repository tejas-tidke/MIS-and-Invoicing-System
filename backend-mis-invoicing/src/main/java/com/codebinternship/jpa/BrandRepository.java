package com.codebinternship.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codebinternship.entity.Brand;
import java.util.List;


public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findByChain_ChainId(Long chainId);

    List<Brand> findByIsActive(boolean isActive);

}