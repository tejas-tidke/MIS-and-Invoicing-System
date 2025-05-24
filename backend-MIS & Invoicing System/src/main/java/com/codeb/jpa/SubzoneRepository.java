package com.codeb.jpa;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeb.entity.Subzone;

public interface SubzoneRepository extends JpaRepository<Subzone, Long> {

    List<Subzone> findByBrandIdAndIsActive(Long brandId, boolean isActive);

    List<Subzone> findByBrandChainChainIdAndIsActive(Long chainId, boolean isActive);

    List<Subzone> findByBrandChainGroupIdAndIsActive(Long groupId, boolean isActive);

    List<Subzone> findByIsActive(boolean isActive);

    Optional<Subzone> findByIdAndIsActive(Long id, boolean isActive);
}