package com.ecommerce.service.impl;

import com.ecommerce.entity.Branding;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.BrandingRepository;
import com.ecommerce.service.BrandingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandingServiceImpl implements BrandingService {

    private final BrandingRepository brandingRepository;

    @Override
    public List<Branding> getAll() {
        return brandingRepository.findAll().stream().filter(b -> !b.isDeleted()).toList();
    }

    @Override
    public Branding getByPlatform(String platform) {
        return getAll().stream()
                .filter(b -> b.getPlatform().equalsIgnoreCase(platform) || "BOTH".equalsIgnoreCase(b.getPlatform()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Branding config not found for platform " + platform));
    }

    @Override
    public Branding upsert(Branding branding) {
        return brandingRepository.save(branding);
    }
}
