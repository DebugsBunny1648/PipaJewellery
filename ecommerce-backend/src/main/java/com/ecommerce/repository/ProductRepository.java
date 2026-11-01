package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {

    Optional<Product> findBySlugAndDeletedFalse(String slug);

    Optional<Product> findBySkuAndDeletedFalse(String sku);

    Page<Product> findByFeaturedTrueAndActiveTrueAndDeletedFalse(Pageable pageable);

    Page<Product> findByNewArrivalTrueAndActiveTrueAndDeletedFalse(Pageable pageable);

    Page<Product> findByBestSellerTrueAndActiveTrueAndDeletedFalse(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrueAndDeletedFalse(String categoryId, Pageable pageable);

    boolean existsBySku(String sku);

    boolean existsBySlug(String slug);
}
