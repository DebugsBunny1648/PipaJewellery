package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "permissions")
public class Permission extends BaseEntity {

    @Indexed(unique = true)
    private String code;      // e.g. PRODUCT_CREATE, ORDER_UPDATE, CMS_MANAGE

    private String module;    // e.g. PRODUCT, ORDER, CMS

    private String description;
}
