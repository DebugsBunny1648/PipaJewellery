package com.ecommerce.repository;

import com.ecommerce.entity.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    Optional<Wishlist> findByCustomerId(String customerId);
}
