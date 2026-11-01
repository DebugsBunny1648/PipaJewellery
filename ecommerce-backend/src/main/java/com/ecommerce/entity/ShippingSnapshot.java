package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

/** Immutable snapshot of the address at the time an order was placed. */
@Getter
@Setter
public class ShippingSnapshot {
    private String recipientName;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String pincode;
}
