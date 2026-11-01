package com.ecommerce.repository;

import com.ecommerce.entity.SmtpConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SmtpConfigRepository extends MongoRepository<SmtpConfig, String> {
}
