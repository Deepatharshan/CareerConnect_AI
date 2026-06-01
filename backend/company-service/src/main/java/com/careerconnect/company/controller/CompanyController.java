package com.careerconnect.company.controller;

import com.careerconnect.company.model.Company;
import com.careerconnect.company.repository.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CompanyRepository repository;

    public CompanyController(CompanyRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Company> createOrUpdateCompany(@RequestBody Company company) {
        Optional<Company> existing = repository.findByOwnerId(company.getOwnerId());
        if (existing.isPresent()) {
            company.setId(existing.get().getId());
        }
        return ResponseEntity.ok(repository.save(company));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Company> getCompanyByOwner(@PathVariable String ownerId) {
        return repository.findByOwnerId(ownerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
