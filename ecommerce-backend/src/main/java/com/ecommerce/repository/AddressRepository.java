package com.ecommerce.repository;

import com.ecommerce.entity.Address;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AddressRepository extends MongoRepository<Address, String> {
    List<Address> findByCustomerIdAndDeletedFalse(String customerId);
}
