package com.ecommerce.service;

import com.ecommerce.entity.Review;
import java.util.List;

public interface ReviewService {
    List<Review> getByProduct(String productId);
    Review create(String customerId, String productId, int rating, String title, String comment);
    Review approve(String id, boolean approved);
    void delete(String id);
}
