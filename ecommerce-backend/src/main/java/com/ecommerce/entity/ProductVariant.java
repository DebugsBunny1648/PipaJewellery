package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/** Embedded sub-document within Product.variants. */
@Getter
@Setter
public class ProductVariant {
    private String id = UUID.randomUUID().toString();
    private String variantSku;
    private String size;
    private String color;
    private BigDecimal weight;
    private BigDecimal priceDelta = BigDecimal.ZERO;
    private Integer stockQuantity = 0;
    private String variantImageUrl;
}
