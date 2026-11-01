package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "carts")
public class Cart extends BaseEntity {

    @Indexed
    private String customerId;      // null for guest carts

    @Indexed(unique = true, sparse = true)
    private String guestToken;      // used to track guest carts via header

    private String couponId;
    private String couponCode;      // denormalized so the cart total can be shown without a lookup

    private List<CartItem> items = new ArrayList<>();
}
