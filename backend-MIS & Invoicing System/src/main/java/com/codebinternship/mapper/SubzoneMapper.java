package com.codebinternship.mapper;

import org.springframework.stereotype.Component;

import com.codebinternship.DTO.SubzoneDTO;
import com.codebinternship.entity.Subzone;

@Component
public class SubzoneMapper {
    
    private final BrandMapper brandMapper;
    
    public SubzoneMapper(BrandMapper brandMapper) {
        this.brandMapper = brandMapper;
    }

    public SubzoneDTO toDto(Subzone subzone) {
        SubzoneDTO dto = new SubzoneDTO();
        dto.setId(subzone.getId());
        dto.setName(subzone.getName());
        dto.setActive(subzone.isActive());
        dto.setCreatedAt(subzone.getCreatedAt());
        dto.setUpdatedAt(subzone.getUpdatedAt());
        
        if(subzone.getBrand() != null) {
            dto.setBrand(brandMapper.toDto(subzone.getBrand()));
        }
        
        return dto;
    }
}