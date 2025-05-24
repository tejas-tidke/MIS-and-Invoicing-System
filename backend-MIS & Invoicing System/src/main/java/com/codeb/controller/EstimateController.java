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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.codeb.DTO.EstimateDTO;
import com.codeb.DTO.EstimateRequest;
import com.codeb.service.EstimateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/estimates")
@RequiredArgsConstructor
public class EstimateController {

    private final EstimateService estimateService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<EstimateDTO> createEstimate(@RequestBody @Valid EstimateRequest request) {
        EstimateDTO response = estimateService.createEstimate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<EstimateDTO> updateEstimate(
            @PathVariable Long id,
            @RequestBody @Valid EstimateRequest request) {
        EstimateDTO response = estimateService.updateEstimate(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<Void> deleteEstimate(@PathVariable Long id) {
        estimateService.deleteEstimate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<EstimateDTO> getEstimateById(@PathVariable Long id) {
        EstimateDTO response = estimateService.getEstimateById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<List<EstimateDTO>> getEstimates(
            @RequestParam(required = false) Long groupId,
            @RequestParam(required = false) Long chainId) {
        
        if (groupId != null) {
            return ResponseEntity.ok(estimateService.getEstimatesByGroup(groupId));
        } 
        if (chainId != null) {
            return ResponseEntity.ok(estimateService.getEstimatesByChain(chainId));
        }
        return ResponseEntity.ok(estimateService.getAllEstimates());
    }

    @GetMapping("/chain/{chainId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<List<EstimateDTO>> getEstimatesByChain(@PathVariable Long chainId) {
        List<EstimateDTO> response = estimateService.getEstimatesByChain(chainId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/group/{groupId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
    public ResponseEntity<List<EstimateDTO>> getEstimatesByGroup(
            @PathVariable String groupId) {  // Changed to String
        if ("all".equalsIgnoreCase(groupId)) {
            return ResponseEntity.ok(estimateService.getAllEstimates());
        }
        try {
            Long id = Long.parseLong(groupId);
            return ResponseEntity.ok(estimateService.getEstimatesByGroup(id));
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid group ID format");
        }
    }
}