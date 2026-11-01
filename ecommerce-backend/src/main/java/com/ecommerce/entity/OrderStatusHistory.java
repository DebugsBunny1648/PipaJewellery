package com.ecommerce.entity;

import com.ecommerce.constant.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/** Embedded sub-document within Order.statusHistory. */
@Getter
@Setter
public class OrderStatusHistory {
    private OrderStatus status;
    private String remarks;
    private String changedBy;
    private LocalDateTime createdAt = LocalDateTime.now();
}
