package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "addresses")
public class Address extends BaseEntity {

    @Indexed
    private String customerId;

    private String label;           // Home, Office, etc.
    private String recipientName;
    private String phone;

    private String addressLine1;
    private String addressLine2;

    private String city;
    private String state;
    private String country;
    private String pincode;

    private boolean isDefault = false;
    private String addressType; // SHIPPING, BILLING, BOTH
}
