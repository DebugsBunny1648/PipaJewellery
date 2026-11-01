package com.ecommerce.repository;

import com.ecommerce.entity.MobileAppConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MobileAppConfigRepository extends MongoRepository<MobileAppConfig, String> {
}
