package com.codeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeb.DTO.BrandCreateDTO;
import com.codeb.DTO.BrandDTO;
import com.codeb.DTO.BrandRequest;
import com.codeb.entity.Brand;
import com.codeb.entity.Chain;
import com.codeb.jpa.BrandRepository;
import com.codeb.jpa.ChainRepository;
import com.codeb.mapper.BrandMapper;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandService {

	private final BrandRepository brandRepository;
	private final ChainRepository chainRepository;
	
    private final BrandMapper brandMapper;


	// Add a new brand
	public Brand addBrand(BrandRequest brandRequest) {
		Chain chain = chainRepository.findById(brandRequest.getChainId())
				.orElseThrow(() -> new RuntimeException("Chain not found"));

		Brand brand = new Brand();
		brand.setBrandName(brandRequest.getBrandName());
		brand.setChain(chain);
		brand.setActive(true); 

		return brandRepository.save(brand);
	}

	// Update an existing brand
	public Brand updateBrand(Long id, BrandRequest brandRequest) {
		Brand brand = brandRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Brand not found with ID: " + id));

		Chain chain = chainRepository.findById(brandRequest.getChainId())
				.orElseThrow(() -> new RuntimeException("Chain not found with ID: " + brandRequest.getChainId()));

		brand.setBrandName(brandRequest.getBrandName());
		brand.setChain(chain);

		return brandRepository.save(brand);
	}

	// Soft delete a brand
	public void deleteBrand(Long id) {
		Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));

		if (brand.getSubzones() != null && !brand.getSubzones().isEmpty()) {
			throw new RuntimeException("Cannot delete brand as it is linked to subzones");
		}

		brand.setActive(false);
		brandRepository.save(brand);
	}

	// Get all active brands
	public List<Brand> getAllActiveBrands() {
		return brandRepository.findByIsActive(true);
	}

	// Get brands by chain ID
	public List<Brand> getBrandsByChainId(Long chainId) {
		return brandRepository.findByChain_ChainId(chainId);
	}
	
	public BrandDTO createBrand(BrandCreateDTO dto) {
        Chain chain = chainRepository.findById(dto.getChainId())
            .orElseThrow(() -> new EntityNotFoundException("Chain not found"));

        Brand brand = new Brand();
        brand.setBrandName(dto.getBrandName());
        brand.setChain(chain);
        brand.setActive(true);

        Brand savedBrand = brandRepository.save(brand);
        return brandMapper.toDto(savedBrand);
    }

    @Transactional(readOnly = true)
    public BrandDTO getBrandById(Long id) {
        return brandRepository.findById(id)
            .map(brandMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
    }
    
    @Transactional(readOnly = true)
    public List<BrandDTO> getAllActiveBrands2() {
        return brandRepository.findByIsActive(true).stream()
            .map(brandMapper::toDto)
            .collect(Collectors.toList());
    }
}