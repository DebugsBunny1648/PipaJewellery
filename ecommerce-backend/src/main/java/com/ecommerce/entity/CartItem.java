package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/** Embedded sub-document within Cart.items — denormalized product name/image snapshot
 *  so rendering the cart never needs a lookup back into the product collection. */
@Getter
@Setter
public class CartItem {
    private String id = UUID.randomUUID().toString();
    private String productId;
    private String productNameSnapshot;
    private String productImageSnapshot;
    private String variantId;
    private String variantLabel;
    private Integer quantity;
    private BigDecimal priceAtAddTime;
}
