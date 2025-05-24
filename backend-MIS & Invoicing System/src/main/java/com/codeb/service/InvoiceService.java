package com.codeb.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeb.DTO.InvoiceDTO;
import com.codeb.DTO.InvoiceRequest;
import com.codeb.entity.Chain;
import com.codeb.entity.Estimate;
import com.codeb.entity.Invoice;
import com.codeb.jpa.ChainRepository;
import com.codeb.jpa.EstimateRepository;
import com.codeb.jpa.InvoiceRepository;
import com.codeb.pdfgen.EmailService;
import com.codeb.pdfgen.PdfGenerationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    
    private final InvoiceRepository invoiceRepository;
    private final EstimateRepository estimateRepository;
    private final ChainRepository chainRepository;
    private final PdfGenerationService pdfService;
    private final EmailService emailService;
    
    @Transactional
    public InvoiceDTO generateInvoice(InvoiceRequest request) {
        Estimate estimate = estimateRepository.findById(request.getEstimateId())
                .orElseThrow(() -> new NoSuchElementException("Estimate not found with ID: " + request.getEstimateId()));
        
        Chain chain = chainRepository.findById(estimate.getChain().getChainId())
                .orElseThrow(() -> new NoSuchElementException("Chain not found"));
        
        Invoice invoice = new Invoice();
        invoice.setEstimate(estimate);
        invoice.setChain(chain);
        invoice.setServiceDetails(estimate.getService());
        invoice.setQuantity(estimate.getQty());
        invoice.setCostPerUnit(estimate.getCostPerUnit());
        invoice.setAmountPayable(estimate.getTotalCost());
        invoice.setBalance(estimate.getTotalCost().subtract(request.getAmountPaid()));
        invoice.setPaymentDate(request.getPaymentDate());
        invoice.setServiceDate(estimate.getDeliveryDate());
        invoice.setDeliveryDetails(estimate.getDeliveryDetails());
        invoice.setClientEmail(request.getClientEmail());
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
       
        byte[] pdfContent = pdfService.generateInvoicePdf(savedInvoice);
        emailService.sendInvoiceEmail(
            savedInvoice.getClientEmail(),
            "Invoice #" + savedInvoice.getInvoiceNo(),
            "Please find your invoice attached",
            pdfContent,
            "invoice_" + savedInvoice.getInvoiceNo() + ".pdf"
        );
        
        return mapToDTO(savedInvoice);
    }
    
    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public byte[] getInvoicePdf(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found with ID: " + id));
        return pdfService.generateInvoicePdf(invoice);
    }
    
    private InvoiceDTO mapToDTO(Invoice invoice) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setId(invoice.getId());
        dto.setInvoiceNo(invoice.getInvoiceNo());
        dto.setEstimateId(invoice.getEstimate().getId());
        dto.setChainName(invoice.getChain().getCompanyName());
        dto.setGstn(invoice.getChain().getGstnNo());
        dto.setServiceDetails(invoice.getServiceDetails());
        dto.setQuantity(invoice.getQuantity());
        dto.setCostPerUnit(invoice.getCostPerUnit());
        dto.setAmountPayable(invoice.getAmountPayable());
        dto.setBalance(invoice.getBalance());
        dto.setPaymentDate(invoice.getPaymentDate());
        dto.setServiceDate(invoice.getServiceDate());
        dto.setDeliveryDetails(invoice.getDeliveryDetails());
        dto.setClientEmail(invoice.getClientEmail());
        dto.setStatus(invoice.getStatus());
        dto.setCreatedAt(invoice.getCreatedAt());
        return dto;
    }
    
    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found with ID: " + id));
        return mapToDTO(invoice);
    }
    
    public List<InvoiceDTO> searchInvoices(String searchTerm) {
        List<Invoice> invoices = invoiceRepository.searchInvoices(searchTerm);
        return invoices.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    
    @Transactional
    public InvoiceDTO updateInvoiceEmail(Long id, String email) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found with ID: " + id));
        
        invoice.setClientEmail(email);
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    @Transactional
    public void deleteInvoice(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new NoSuchElementException("Invoice not found with ID: " + id);
        }
        invoiceRepository.deleteById(id);
    }

}
