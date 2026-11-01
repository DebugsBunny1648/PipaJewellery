package com.ecommerce.service;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.entity.Address;

import java.util.List;

public interface AddressService {
    List<Address> getByCustomer(String customerId);
    Address create(String customerId, AddressRequest request);
    Address update(String customerId, String addressId, AddressRequest request);
    void delete(String customerId, String addressId);
    Address setDefault(String customerId, String addressId);
}
