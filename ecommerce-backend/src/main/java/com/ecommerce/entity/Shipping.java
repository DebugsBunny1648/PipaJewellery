package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/** Embedded 1:1 sub-document on Order.shipping. */
@Getter
@Setter
public class Shipping {
    private String carrierName;
    private String trackingNumber;
    private String trackingUrl;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime estimatedDeliveryDate;
    private String currentStatus;
}
