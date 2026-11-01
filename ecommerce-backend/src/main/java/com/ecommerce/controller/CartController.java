package com.ecommerce.controller;

import com.ecommerce.dto.request.AddToCartRequest;
import com.ecommerce.dto.request.UpdateCartItemRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Supports both logged-in customers (JWT) and guests (X-Guest-Token header),
 * matching the "cart should support both guest and logged-in users" requirement.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Guest and logged-in cart management")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        return ApiResponse.success(cartService.getCart(customerId(principal), guestToken));
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
                                              @Valid @RequestBody AddToCartRequest request) {
        return ApiResponse.success("Item added to cart", cartService.addItem(customerId(principal), guestToken, request));
    }

    @PutMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateItem(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
                                                 @PathVariable String itemId,
                                                 @Valid @RequestBody UpdateCartItemRequest request) {
        return ApiResponse.success("Cart item updated", cartService.updateItem(customerId(principal), guestToken, itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<CartResponse> removeItem(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
                                                 @PathVariable String itemId) {
        return ApiResponse.success("Item removed from cart", cartService.removeItem(customerId(principal), guestToken, itemId));
    }

    @DeleteMapping
    public ApiResponse<CartResponse> clear(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        return ApiResponse.success("Cart cleared", cartService.clearCart(customerId(principal), guestToken));
    }

    @PostMapping("/coupon")
    public ApiResponse<CartResponse> applyCoupon(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
                                                  @RequestParam String code) {
        return ApiResponse.success("Coupon applied", cartService.applyCoupon(customerId(principal), guestToken, code));
    }

    @DeleteMapping("/coupon")
    public ApiResponse<CartResponse> removeCoupon(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        return ApiResponse.success("Coupon removed", cartService.removeCoupon(customerId(principal), guestToken));
    }

    private String customerId(UserPrincipal principal) {
        return principal != null && "CUSTOMER".equals(principal.getUserType()) ? principal.getId() : null;
    }
}
