package com.codeb.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.codeb.DTO.ChainRequest;
import com.codeb.entity.Chain;
import com.codeb.entity.Group;
import com.codeb.jpa.ChainRepository;
import com.codeb.jpa.GroupRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChainService {

    private final ChainRepository chainRepository;
    private final GroupRepository groupRepository;
 

    public Chain addChain(ChainRequest chainRequest) {
        Group group = groupRepository.findById(chainRequest.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (chainRepository.existsByGstnNo(chainRequest.getGstnNo())) {
            throw new RuntimeException("GSTN number already exists");
        }

        Chain chain = new Chain();
        chain.setCompanyName(chainRequest.getCompanyName());
        chain.setGstnNo(chainRequest.getGstnNo());
        chain.setGroup(group);
        chain.setCreatedAt(LocalDateTime.now());
        chain.setUpdatedAt(LocalDateTime.now());

        return chainRepository.save(chain);
    }

    public Chain updateChain(Long chainId, ChainRequest chainRequest) {
        Chain chain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        Group group = groupRepository.findById(chainRequest.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!chain.getGstnNo().equals(chainRequest.getGstnNo())) {
            if (chainRepository.existsByGstnNo(chainRequest.getGstnNo())) {
                throw new RuntimeException("GSTN number already exists");
            }
        }

        chain.setCompanyName(chainRequest.getCompanyName());
        chain.setGstnNo(chainRequest.getGstnNo());
        chain.setGroup(group);
        chain.setUpdatedAt(LocalDateTime.now());

        return chainRepository.save(chain);
    }

    public void deleteChain(Long chainId) {
        Chain chain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        if (!chain.getBrands().isEmpty()) {
            throw new RuntimeException("Cannot delete chain as it is linked to brands");
        }

        chain.setActive(false);
        chainRepository.save(chain);
    }

    public List<Chain> getChainsByGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return chainRepository.findByGroup(group);
    }

    public List<Chain> getAllChains() {
        return chainRepository.findAllWithGroup();
    }
    
	public List<Group> getAllGroups() {
		return groupRepository.findByIsActive(true);
	}
}