package com.ecommerce.repository;

import com.ecommerce.entity.Coupon;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CouponRepository extends MongoRepository<Coupon, String> {
    Optional<Coupon> findByCodeAndActiveTrueAndDeletedFalse(String code);
}
