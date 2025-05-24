package com.codeb.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeb.DTO.InvoiceDTO;
import com.codeb.DTO.InvoiceRequest;
import com.codeb.entity.Invoice;
import com.codeb.jpa.InvoiceRepository;
import com.codeb.service.InvoiceService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    
    private final InvoiceService invoiceService;
    public final InvoiceRepository invoiceRepository;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ACCOUNTANT')")
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody @Valid InvoiceRequest request) {
        return new ResponseEntity<>(invoiceService.generateInvoice(request), HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }
	/*
	 * @GetMapping("/{id}/pdf") public ResponseEntity<byte[]>
	 * downloadInvoicePdf(@PathVariable Long id) { return ResponseEntity.ok()
	 * .header("Content-Disposition", "attachment; filename=\"invoice.pdf\"")
	 * .body(invoiceService.getInvoicePdf(id)); }
	 */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found"));
        
        String filename = String.format("invoice_%s.pdf", invoice.getInvoiceNo());
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(invoiceService.getInvoicePdf(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<InvoiceDTO>> searchInvoices(@RequestParam String term) {
        return ResponseEntity.ok(invoiceService.searchInvoices(term));
    }
    
    @PatchMapping("/{id}/email")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ACCOUNTANT')")
    public ResponseEntity<InvoiceDTO> updateInvoiceEmail(
            @PathVariable Long id, 
            @RequestBody @Email @NotBlank String email) {
        return ResponseEntity.ok(invoiceService.updateInvoiceEmail(id, email));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ACCOUNTANT')")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}