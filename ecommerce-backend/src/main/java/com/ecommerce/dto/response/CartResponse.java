package com.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private String id;
    private List<CartItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal total;
    private String appliedCouponCode;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private String id;
        private String productId;
        private String productName;
        private String productImage;
        private String variantId;
        private String variantLabel;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }
}
