package com.ecommerce.repository;

import com.ecommerce.entity.SiteConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SiteConfigRepository extends MongoRepository<SiteConfig, String> {
    Optional<SiteConfig> findByConfigKey(String key);
    List<SiteConfig> findByConfigGroup(String group);
}
