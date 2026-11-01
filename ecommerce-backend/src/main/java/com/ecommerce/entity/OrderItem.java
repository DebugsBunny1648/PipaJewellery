package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/** Embedded sub-document within Order.items. */
@Getter
@Setter
public class OrderItem {
    private String productId;
    private String variantId;
    private String productNameSnapshot;
    private String productSkuSnapshot;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}
