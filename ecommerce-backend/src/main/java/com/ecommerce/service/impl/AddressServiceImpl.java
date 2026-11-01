package com.ecommerce.service.impl;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.entity.Address;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;

    @Override
    public List<Address> getByCustomer(String customerId) {
        return addressRepository.findByCustomerIdAndDeletedFalse(customerId);
    }

    @Override
    public Address create(String customerId, AddressRequest request) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer", "id", customerId);
        }
        Address address = new Address();
        address.setCustomerId(customerId);
        apply(address, request);
        Address saved = addressRepository.save(address);
        if (request.isDefault()) clearOtherDefaults(customerId, saved.getId());
        return saved;
    }

    @Override
    public Address update(String customerId, String addressId, AddressRequest request) {
        Address address = findOwned(customerId, addressId);
        apply(address, request);
        Address saved = addressRepository.save(address);
        if (request.isDefault()) clearOtherDefaults(customerId, addressId);
        return saved;
    }

    @Override
    public void delete(String customerId, String addressId) {
        Address address = findOwned(customerId, addressId);
        address.setDeleted(true);
        address.setDeletedAt(java.time.LocalDateTime.now());
        addressRepository.save(address);
    }

    @Override
    public Address setDefault(String customerId, String addressId) {
        Address address = findOwned(customerId, addressId);
        clearOtherDefaults(customerId, addressId);
        address.setDefault(true);
        return addressRepository.save(address);
    }

    private void clearOtherDefaults(String customerId, String exceptAddressId) {
        getByCustomer(customerId).forEach(a -> {
            if (a.isDefault() && !a.getId().equals(exceptAddressId)) {
                a.setDefault(false);
                addressRepository.save(a);
            }
        });
    }

    private void apply(Address address, AddressRequest request) {
        address.setLabel(request.getLabel());
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setCountry(request.getCountry());
        address.setPincode(request.getPincode());
        address.setDefault(request.isDefault());
        address.setAddressType(request.getAddressType());
    }

    private Address findOwned(String customerId, String addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
        if (!address.getCustomerId().equals(customerId)) {
            throw new ResourceNotFoundException("Address", "id", addressId);
        }
        return address;
    }
}
