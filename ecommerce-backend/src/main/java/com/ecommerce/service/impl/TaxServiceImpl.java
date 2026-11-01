package com.ecommerce.service.impl;

import com.ecommerce.entity.Tax;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.TaxRepository;
import com.ecommerce.service.TaxService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaxServiceImpl implements TaxService {

    private final TaxRepository taxRepository;

    @Override
    public List<Tax> getAll() {
        return taxRepository.findAll().stream().filter(t -> !t.isDeleted()).toList();
    }

    @Override
    public Tax getById(String id) {
        return find(id);
    }

    @Override
    public Tax create(Tax tax) {
        return taxRepository.save(tax);
    }

    @Override
    public Tax update(String id, Tax tax) {
        Tax existing = find(id);
        tax.setId(existing.getId());
        return taxRepository.save(tax);
    }

    @Override
    public void delete(String id) {
        Tax tax = find(id);
        tax.setDeleted(true);
        taxRepository.save(tax);
    }

    private Tax find(String id) {
        return taxRepository.findById(id)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Tax", "id", id));
    }
}
