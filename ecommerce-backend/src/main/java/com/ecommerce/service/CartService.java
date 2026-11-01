package com.ecommerce.service;

import com.ecommerce.dto.request.AddToCartRequest;
import com.ecommerce.dto.request.UpdateCartItemRequest;
import com.ecommerce.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(String customerId, String guestToken);
    CartResponse addItem(String customerId, String guestToken, AddToCartRequest request);
    CartResponse updateItem(String customerId, String guestToken, String itemId, UpdateCartItemRequest request);
    CartResponse removeItem(String customerId, String guestToken, String itemId);
    CartResponse clearCart(String customerId, String guestToken);
    CartResponse applyCoupon(String customerId, String guestToken, String couponCode);
    CartResponse removeCoupon(String customerId, String guestToken);
}
