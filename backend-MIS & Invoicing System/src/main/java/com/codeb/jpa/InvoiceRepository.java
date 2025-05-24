package com.codeb.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codeb.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByEstimateId(Long estimateId);

    Optional<Invoice> findByInvoiceNo(String invoiceNo);

    @Query("SELECT i FROM Invoice i WHERE " +
            "i.invoiceNo LIKE %:searchTerm% OR " +
            "i.chain.companyName LIKE %:searchTerm% OR " +
            "CAST(i.estimate.id AS string) LIKE %:searchTerm%")
    List<Invoice> searchInvoices(@Param("searchTerm") String searchTerm);
}