package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/** Embedded sub-document within Product.images. */
@Getter
@Setter
public class ProductImage {
    private String id = UUID.randomUUID().toString();
    private String imageUrl;
    private String altText;
    private boolean primary = false;
    private Integer sortOrder = 0;
}
