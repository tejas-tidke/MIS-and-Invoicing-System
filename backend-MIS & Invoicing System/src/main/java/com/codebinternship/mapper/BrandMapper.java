package com.codebinternship.mapper;

import org.springframework.stereotype.Component;

import com.codebinternship.DTO.BrandDTO;
import com.codebinternship.DTO.ChainSimpleDTO;
import com.codebinternship.DTO.GroupSimpleDTO;
import com.codebinternship.entity.Brand;
import com.codebinternship.entity.Chain;
import com.codebinternship.entity.Group;

@Component
public class BrandMapper {

    public BrandDTO toDto(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setBrandName(brand.getBrandName());
        dto.setActive(brand.isActive());
        dto.setCreatedAt(brand.getCreatedAt());
        dto.setUpdatedAt(brand.getUpdatedAt());  
        
        if(brand.getChain() != null) {
            dto.setChain(mapChainToSimpleDto(brand.getChain()));
        }
        
        return dto;
    }

    private ChainSimpleDTO mapChainToSimpleDto(Chain chain) {
        ChainSimpleDTO dto = new ChainSimpleDTO();
        dto.setChainId(chain.getChainId());
        dto.setCompanyName(chain.getCompanyName());
        dto.setGstnNo(chain.getGstnNo());
        dto.setActive(chain.isActive());
        dto.setCreatedAt(chain.getCreatedAt());
        dto.setUpdatedAt(chain.getUpdatedAt());
        
        if(chain.getGroup() != null) {
            dto.setGroup(mapGroupToSimpleDto(chain.getGroup()));
        }
        
        return dto;
    }

    private GroupSimpleDTO mapGroupToSimpleDto(Group group) {
        GroupSimpleDTO dto = new GroupSimpleDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setActive(group.isActive());
        dto.setCreatedAt(group.getCreatedAt());  
        dto.setUpdatedAt(group.getUpdatedAt());  
        return dto;
    }
}