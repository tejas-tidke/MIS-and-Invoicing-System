package com.codeb.mapper;

import org.springframework.stereotype.Component;

import com.codeb.DTO.EstimateDTO;
import com.codeb.DTO.EstimateRequest;
import com.codeb.entity.Estimate;

@Component
public class EstimateMapper {
    
    public EstimateDTO toDto(Estimate estimate) {
        EstimateDTO dto = new EstimateDTO();
        dto.setEstimateId(estimate.getId());
        dto.setChainId(estimate.getChain().getChainId());
        dto.setGroupName(estimate.getGroupName());
        dto.setBrandName(estimate.getBrandName());
        dto.setZoneName(estimate.getZoneName());
        dto.setService(estimate.getService());
        dto.setQty(estimate.getQty());
        dto.setCostPerUnit(estimate.getCostPerUnit());
        dto.setTotalCost(estimate.getTotalCost());
        dto.setDeliveryDate(estimate.getDeliveryDate());
        dto.setDeliveryDetails(estimate.getDeliveryDetails());
        dto.setCreatedAt(estimate.getCreatedAt());
        dto.setUpdatedAt(estimate.getUpdatedAt());
        return dto;
    }
    
    public Estimate toEntity(EstimateRequest request) {
        Estimate estimate = new Estimate();
        estimate.setService(request.getService());
        estimate.setQty(request.getQty());
        estimate.setCostPerUnit(request.getCostPerUnit());
        estimate.setDeliveryDate(request.getDeliveryDate());
        estimate.setDeliveryDetails(request.getDeliveryDetails());
        estimate.setBrandName(request.getBrandName());
        estimate.setZoneName(request.getZoneName());
        return estimate;
    }
}