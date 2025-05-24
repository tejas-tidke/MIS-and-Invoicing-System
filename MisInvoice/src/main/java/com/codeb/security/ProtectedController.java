package com.codeb.security;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProtectedController {

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "This is a protected endpoint.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')") 
    public String adminEndpoint() {
        return "This is an admin-only endpoint.";
    }

    @GetMapping("/sales")
    @PreAuthorize("hasRole('SALES_PERSON')") 
    public String salesEndpoint() {
        return "This is a sales-only endpoint.";
    }
}