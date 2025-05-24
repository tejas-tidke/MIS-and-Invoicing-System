
package com.codeb.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeb.DTO.BrandCreateDTO;
import com.codeb.DTO.BrandDTO;
import com.codeb.DTO.BrandRequest;
import com.codeb.entity.Brand;
import com.codeb.service.BrandService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    // Add a new brand
//    @PostMapping
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<Brand> addBrand(@RequestBody BrandRequest brandRequest) {
//        Brand brand = brandService.addBrand(brandRequest);
//        return ResponseEntity.ok(brand);
//    }

    // Update an existing brand
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody BrandRequest brandRequest) {
        Brand brand = brandService.updateBrand(id, brandRequest);
        return ResponseEntity.ok(brand);
    }

    // Soft delete a brand
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok("Brand deleted successfully");
    }

    // Get all active brands
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<List<Brand>> getAllActiveBrands() {
        List<Brand> brands = brandService.getAllActiveBrands();
        return ResponseEntity.ok(brands);
    }

    // Get brands by chain ID
    @GetMapping("/chain/{chainId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<List<Brand>> getBrandsByChainId(@PathVariable Long chainId) {
        List<Brand> brands = brandService.getBrandsByChainId(chainId);
        return ResponseEntity.ok(brands);
    }
    
    @PostMapping
    public ResponseEntity<BrandDTO> createBrand(@RequestBody @Valid BrandCreateDTO dto) {
        BrandDTO created = brandService.createBrand(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandDTO> getBrand(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }
    
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<List<BrandDTO>> getAllActiveBrands2() {
        List<BrandDTO> brands = brandService.getAllActiveBrands2();
        return ResponseEntity.ok(brands);
    }
    

  
}