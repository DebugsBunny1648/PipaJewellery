package com.ecommerce.service;

import com.ecommerce.dto.response.ProductResponse;

import java.util.List;

public interface WishlistService {
    List<ProductResponse> getWishlist(String customerId);
    void addToWishlist(String customerId, String productId);
    void removeFromWishlist(String customerId, String productId);
}
