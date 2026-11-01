package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "wishlists")
public class Wishlist extends BaseEntity {

    @Indexed(unique = true)
    private String customerId;

    private List<String> productIds = new ArrayList<>();
}
