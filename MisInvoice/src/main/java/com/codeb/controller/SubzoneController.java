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

import com.codeb.DTO.SubzoneDTO;
import com.codeb.DTO.SubzoneRequest;
import com.codeb.service.SubzoneService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subzones")
@RequiredArgsConstructor
public class SubzoneController {

	private final SubzoneService subzoneService;

	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<SubzoneDTO> createSubzone(@RequestBody @Valid SubzoneRequest request) {
		SubzoneDTO response = subzoneService.createSubzone(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<SubzoneDTO> updateSubzone(@PathVariable Long id, @RequestBody @Valid SubzoneRequest request) {
		SubzoneDTO response = subzoneService.updateSubzone(id, request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Void> deleteSubzone(@PathVariable Long id) {
		subzoneService.softDeleteSubzone(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
	public ResponseEntity<SubzoneDTO> getSubzoneById(@PathVariable Long id) {
		SubzoneDTO response = subzoneService.getSubzoneById(id);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
	public ResponseEntity<List<SubzoneDTO>> getAllActiveSubzones() {
		List<SubzoneDTO> response = subzoneService.getAllActiveSubzones();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/brand/{brandId}")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SALES_PERSON')")
	public ResponseEntity<List<SubzoneDTO>> getSubzonesByBrand(@PathVariable Long brandId) {
		List<SubzoneDTO> response = subzoneService.getSubzonesByBrand(brandId);
		return ResponseEntity.ok(response);
	}
}