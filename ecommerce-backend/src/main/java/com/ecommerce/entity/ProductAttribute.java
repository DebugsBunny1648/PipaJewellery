package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * The attribute *catalog* (still a top-level collection) — lets the admin panel offer a
 * dropdown of known attribute names ("Material", "Purity", "RAM"...) when building a
 * product form. The actual values live denormalized on each Product (see ProductAttributeValue).
 */
@Getter
@Setter
@Document(collection = "product_attributes")
public class ProductAttribute extends BaseEntity {

    @Indexed(unique = true)
    private String name;

    private String inputType;   // TEXT, NUMBER, SELECT, MULTI_SELECT, BOOLEAN
    private String applicableProductType; // e.g. JEWELLERY, ELECTRONICS, ALL
    private boolean filterable = true;
    private boolean required = false;
}
