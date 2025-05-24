package com.codeb.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeb.DTO.ChainRequest;
import com.codeb.entity.Chain;
import com.codeb.entity.Group;
import com.codeb.service.ChainService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chains")
@RequiredArgsConstructor
public class ChainController {

    private final ChainService chainService;

    // Add a new Chain
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Chain> addChain(@Valid @RequestBody ChainRequest chainRequest) {
        Chain chain = chainService.addChain(chainRequest);
        return ResponseEntity.ok(chain);
    }

    // Update an existing Chain
    @PutMapping("/{chainId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Chain> updateChain(@PathVariable Long chainId, @Valid @RequestBody ChainRequest chainRequest) {
        Chain chain = chainService.updateChain(chainId, chainRequest);
        return ResponseEntity.ok(chain);
    }

    // Delete a Chain
    @DeleteMapping("/{chainId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteChain(@PathVariable Long chainId) {
        chainService.deleteChain(chainId);
        return ResponseEntity.ok("Chain deleted successfully");
    }

   
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Chain>> getChainsByGroup(@PathVariable String groupId) {
        List<Chain> chains;

        if ("all".equalsIgnoreCase(groupId)) {
            chains = chainService.getAllChains();  
        } else {
            try {
                Long parsedGroupId = Long.parseLong(groupId); 
                chains = chainService.getChainsByGroup(parsedGroupId);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build(); 
            }
        }

        return ResponseEntity.ok(chains);
    }

    
    @GetMapping
    public ResponseEntity<List<Chain>> getChains(@RequestParam(required = false) String groupId) {
        List<Chain> chains;

        if (groupId == null || "all".equalsIgnoreCase(groupId)) {
            chains = chainService.getAllChains();
        } else {
            try {
                Long parsedGroupId = Long.parseLong(groupId);
                chains = chainService.getChainsByGroup(parsedGroupId);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.ok(chains);
    }
    
    @GetMapping("/allgroups")
	public ResponseEntity<List<Group>> getAllGroups() {
		return ResponseEntity.ok(chainService.getAllGroups());
	}
}
