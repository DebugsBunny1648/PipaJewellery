package com.ecommerce.service;

import com.ecommerce.entity.Branding;
import java.util.List;

public interface BrandingService {
    List<Branding> getAll();
    Branding getByPlatform(String platform);
    Branding upsert(Branding branding);
}
