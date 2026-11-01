package com.ecommerce.repository;

import com.ecommerce.entity.ProductAttribute;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductAttributeRepository extends MongoRepository<ProductAttribute, String> {
}
