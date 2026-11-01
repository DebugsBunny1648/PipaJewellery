package com.ecommerce.repository;

import com.ecommerce.entity.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByCustomerId(String customerId);
    Optional<Cart> findByGuestToken(String guestToken);
}
