package com.ecommerce.repository;

import com.ecommerce.entity.Branding;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BrandingRepository extends MongoRepository<Branding, String> {
}
