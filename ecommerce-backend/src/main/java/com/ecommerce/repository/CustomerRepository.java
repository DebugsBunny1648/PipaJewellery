package com.ecommerce.repository;

import com.ecommerce.entity.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {

    Optional<Customer> findByEmailAndDeletedFalse(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}
