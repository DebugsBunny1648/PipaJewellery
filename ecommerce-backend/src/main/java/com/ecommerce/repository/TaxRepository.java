package com.ecommerce.repository;

import com.ecommerce.entity.Tax;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaxRepository extends MongoRepository<Tax, String> {
}
