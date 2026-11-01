package com.ecommerce.entity;

import com.ecommerce.constant.PaymentMethod;
import com.ecommerce.constant.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Embedded 1:1 sub-document on Order.payment. */
@Getter
@Setter
public class Payment {
    private PaymentMethod method;
    private PaymentStatus status = PaymentStatus.PENDING;
    private BigDecimal amount;
    private String transactionId;
    private String gatewayName;
    private String gatewayResponse;
    private LocalDateTime paidAt;
    private LocalDateTime refundedAt;
    private BigDecimal refundAmount;
}
