package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Getter
@Setter
@Document(collection = "taxes")
public class Tax extends BaseEntity {

    private String name;      // GST, VAT, etc.
    private BigDecimal percentage;

    private String categoryId;   // null => applies platform-wide

    private String country;
    private String state;
}
