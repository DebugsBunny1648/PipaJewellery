package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "reviews")
public class Review extends BaseEntity {

    @Indexed
    private String productId;

    private String customerId;

    private Integer rating;    // 1-5
    private String title;
    private String comment;

    private boolean verifiedPurchase = false;
    private boolean approved = false;
}
