package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * Embedded sub-document within Product.attributeValues — denormalized on purpose
 * (attributeName + value directly, no lookup into the ProductAttribute catalog needed
 * to render a product page).
 */
@Getter
@Setter
public class ProductAttributeValue {
    private String attributeName;
    private String value;
}
