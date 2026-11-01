package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ApiResponse<List<ProductResponse>> getWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(wishlistService.getWishlist(principal.getId()));
    }

    @PostMapping("/{productId}")
    public ApiResponse<Void> add(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String productId) {
        wishlistService.addToWishlist(principal.getId(), productId);
        return ApiResponse.success("Added to wishlist", null);
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Void> remove(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String productId) {
        wishlistService.removeFromWishlist(principal.getId(), productId);
        return ApiResponse.success("Removed from wishlist", null);
    }
}
