package com.codeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeb.DTO.EstimateDTO;
import com.codeb.DTO.EstimateRequest;
import com.codeb.entity.Chain;
import com.codeb.entity.Estimate;
import com.codeb.jpa.ChainRepository;
import com.codeb.jpa.EstimateRepository;
import com.codeb.mapper.EstimateMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstimateService {
    
    private final EstimateRepository estimateRepository;
    private final ChainRepository chainRepository;
    private final EstimateMapper estimateMapper;
    
    @Transactional
    public EstimateDTO createEstimate(EstimateRequest request) {
        Chain chain = chainRepository.findById(request.getChainId())
                .orElseThrow(() -> new RuntimeException("Chain not found with id: " + request.getChainId()));
        
        Estimate estimate = estimateMapper.toEntity(request);
        estimate.setChain(chain);
        
        Estimate savedEstimate = estimateRepository.save(estimate);
        return estimateMapper.toDto(savedEstimate);
    }
    
    @Transactional
    public EstimateDTO updateEstimate(Long id, EstimateRequest request) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found with id: " + id));
        
        Chain chain = chainRepository.findById(request.getChainId())
                .orElseThrow(() -> new RuntimeException("Chain not found with id: " + request.getChainId()));
        
        estimate.setChain(chain);
        estimate.setService(request.getService());
        estimate.setQty(request.getQty());
        estimate.setCostPerUnit(request.getCostPerUnit());
        estimate.setDeliveryDate(request.getDeliveryDate());
        estimate.setDeliveryDetails(request.getDeliveryDetails());
        estimate.setBrandName(request.getBrandName());
        estimate.setZoneName(request.getZoneName());
        
        Estimate updatedEstimate = estimateRepository.save(estimate);
        return estimateMapper.toDto(updatedEstimate);
    }
    
    @Transactional
    public void deleteEstimate(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found with id: " + id));
        estimateRepository.delete(estimate);
    }
    
    public EstimateDTO getEstimateById(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found with id: " + id));
        return estimateMapper.toDto(estimate);
    }
    
    public List<EstimateDTO> getEstimatesByChain(Long chainId) {
        return estimateRepository.findByChainChainId(chainId).stream()
                .map(estimateMapper::toDto)
                .collect(Collectors.toList());
    }
    
    public List<EstimateDTO> getEstimatesByGroup(Long groupId) {
        return estimateRepository.findByChainGroupId(groupId).stream()
                .map(estimateMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Add this new method
    public List<EstimateDTO> getAllEstimates() {
        return estimateRepository.findAll().stream()
                .map(estimateMapper::toDto)
                .collect(Collectors.toList());
    }
}