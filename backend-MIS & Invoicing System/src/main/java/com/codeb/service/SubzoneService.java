package com.codeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeb.DTO.SubzoneDTO;
import com.codeb.DTO.SubzoneRequest;
import com.codeb.entity.Brand;
import com.codeb.entity.Subzone;
import com.codeb.jpa.BrandRepository;
import com.codeb.jpa.SubzoneRepository;
import com.codeb.mapper.SubzoneMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubzoneService {
    
    private final SubzoneRepository subzoneRepository;
    private final BrandRepository brandRepository;
    private final SubzoneMapper subzoneMapper;
    
    @Transactional
    public SubzoneDTO createSubzone(SubzoneRequest request) {
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + request.getBrandId()));
        
        if (!brand.isActive()) {
            throw new RuntimeException("Cannot create subzone for inactive brand");
        }
        
        Subzone subzone = new Subzone();
        subzone.setName(request.getName());
        subzone.setBrand(brand);
        subzone.setActive(true);
        
        Subzone savedSubzone = subzoneRepository.save(subzone);
        return subzoneMapper.toDto(savedSubzone);
    }
    
    @Transactional
    public SubzoneDTO updateSubzone(Long id, SubzoneRequest request) {
        Subzone subzone = subzoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subzone not found with id: " + id));
        
        if (!subzone.isActive()) {
            throw new RuntimeException("Cannot update inactive subzone");
        }
        
        if (!subzone.getBrand().getId().equals(request.getBrandId())) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found with id: " + request.getBrandId()));
            
            if (!brand.isActive()) {
                throw new RuntimeException("Cannot move subzone to inactive brand");
            }
            subzone.setBrand(brand);
        }
        
        subzone.setName(request.getName());
        Subzone updatedSubzone = subzoneRepository.save(subzone);
        return subzoneMapper.toDto(updatedSubzone);
    }
    
    @Transactional
    public void softDeleteSubzone(Long id) {
        Subzone subzone = subzoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subzone not found with id: " + id));
        
        if (!subzone.isActive()) {
            throw new RuntimeException("Subzone is already inactive");
        }
        
        subzone.setActive(false);
        subzoneRepository.save(subzone);
    }
    
    public SubzoneDTO getSubzoneById(Long id) {
        Subzone subzone = subzoneRepository.findByIdAndIsActive(id, true)
                .orElseThrow(() -> new RuntimeException("Active subzone not found with id: " + id));
        return subzoneMapper.toDto(subzone);
    }
    
    public List<SubzoneDTO> getAllActiveSubzones() {
        return subzoneRepository.findByIsActive(true).stream()
                .map(subzoneMapper::toDto)
                .collect(Collectors.toList());
    }
    
    public List<SubzoneDTO> getSubzonesByBrand(Long brandId) {
        return subzoneRepository.findByBrandIdAndIsActive(brandId, true).stream()
                .map(subzoneMapper::toDto)
                .collect(Collectors.toList());
    }
}