package com.ecommerce.service.impl;

import com.ecommerce.constant.DiscountType;
import com.ecommerce.dto.request.AddToCartRequest;
import com.ecommerce.dto.request.UpdateCartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.CouponRepository;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CouponRepository couponRepository;

    @Override
    public CartResponse getCart(String customerId, String guestToken) {
        return toResponse(resolveCart(customerId, guestToken, false));
    }

    @Override
    public CartResponse addItem(String customerId, String guestToken, AddToCartRequest request) {
        Cart cart = resolveCart(customerId, guestToken, true);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = product.getVariants().stream()
                    .filter(v -> v.getId().equals(request.getVariantId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant", "id", request.getVariantId()));
        }

        String variantId = variant != null ? variant.getId() : null;
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(product.getId())
                        && java.util.Objects.equals(i.getVariantId(), variantId))
                .findFirst();

        BigDecimal unitPrice = product.getFinalPrice()
                .add(variant != null ? variant.getPriceDelta() : BigDecimal.ZERO);

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            CartItem item = new CartItem();
            item.setProductId(product.getId());
            item.setProductNameSnapshot(product.getName());
            item.setProductImageSnapshot(product.getImages().isEmpty() ? null : product.getImages().get(0).getImageUrl());
            item.setVariantId(variantId);
            item.setVariantLabel(variant != null
                    ? String.join("/", safe(variant.getSize()), safe(variant.getColor())) : null);
            item.setQuantity(request.getQuantity());
            item.setPriceAtAddTime(unitPrice);
            cart.getItems().add(item);
        }
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse updateItem(String customerId, String guestToken, String itemId, UpdateCartItemRequest request) {
        Cart cart = resolveCart(customerId, guestToken, false);
        CartItem item = findItemInCart(cart, itemId);
        item.setQuantity(request.getQuantity());
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse removeItem(String customerId, String guestToken, String itemId) {
        Cart cart = resolveCart(customerId, guestToken, false);
        findItemInCart(cart, itemId); // validates it exists / belongs to this cart
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse clearCart(String customerId, String guestToken) {
        Cart cart = resolveCart(customerId, guestToken, false);
        cart.getItems().clear();
        cart.setCouponId(null);
        cart.setCouponCode(null);
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse applyCoupon(String customerId, String guestToken, String couponCode) {
        Cart cart = resolveCart(customerId, guestToken, false);
        Coupon coupon = couponRepository.findByCodeAndActiveTrueAndDeletedFalse(couponCode)
                .orElseThrow(() -> new BadRequestException("Invalid or expired coupon code"));

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            throw new BadRequestException("This coupon is not yet active");
        }
        if (coupon.getEndDate() != null && now.isAfter(coupon.getEndDate())) {
            throw new BadRequestException("This coupon has expired");
        }
        if (coupon.getUsageLimitTotal() != null && coupon.getUsedCount() >= coupon.getUsageLimitTotal()) {
            throw new BadRequestException("This coupon has reached its usage limit");
        }

        BigDecimal subtotal = calculateSubtotal(cart);
        if (coupon.getMinOrderValue() != null && subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new BadRequestException("Minimum order value for this coupon is " + coupon.getMinOrderValue());
        }

        cart.setCouponId(coupon.getId());
        cart.setCouponCode(coupon.getCode());
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse removeCoupon(String customerId, String guestToken) {
        Cart cart = resolveCart(customerId, guestToken, false);
        cart.setCouponId(null);
        cart.setCouponCode(null);
        return toResponse(cartRepository.save(cart));
    }

    // ---------------------------------------------------------------------

    private Cart resolveCart(String customerId, String guestToken, boolean createIfMissing) {
        if (customerId != null) {
            if (!customerRepository.existsById(customerId)) {
                throw new ResourceNotFoundException("Customer", "id", customerId);
            }
            return cartRepository.findByCustomerId(customerId)
                    .orElseGet(() -> createIfMissing ? cartRepository.save(newCart(customerId, null)) : newCart(customerId, null));
        }
        if (guestToken == null || guestToken.isBlank()) {
            throw new BadRequestException("Either an authenticated customer or a guest token is required");
        }
        return cartRepository.findByGuestToken(guestToken)
                .orElseGet(() -> cartRepository.save(newCart(null, guestToken)));
    }

    private Cart newCart(String customerId, String guestToken) {
        Cart cart = new Cart();
        cart.setCustomerId(customerId);
        cart.setGuestToken(guestToken);
        return cart;
    }

    private CartItem findItemInCart(Cart cart, String itemId) {
        return cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));
    }

    private BigDecimal calculateSubtotal(Cart cart) {
        return cart.getItems().stream()
                .map(i -> i.getPriceAtAddTime().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private CartResponse toResponse(Cart cart) {
        List<CartResponse.CartItemResponse> items = cart.getItems().stream().map(i ->
                CartResponse.CartItemResponse.builder()
                        .id(i.getId())
                        .productId(i.getProductId())
                        .productName(i.getProductNameSnapshot())
                        .productImage(i.getProductImageSnapshot())
                        .variantId(i.getVariantId())
                        .variantLabel(i.getVariantLabel())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getPriceAtAddTime())
                        .lineTotal(i.getPriceAtAddTime().multiply(BigDecimal.valueOf(i.getQuantity())))
                        .build()
        ).collect(Collectors.toList());

        BigDecimal subtotal = calculateSubtotal(cart);
        BigDecimal discount = BigDecimal.ZERO;
        if (cart.getCouponId() != null) {
            Coupon coupon = couponRepository.findById(cart.getCouponId()).orElse(null);
            if (coupon != null) {
                if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
                    discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
                    if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                        discount = coupon.getMaxDiscountAmount();
                    }
                } else {
                    discount = coupon.getDiscountValue();
                }
            }
        }

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .discount(discount)
                .total(subtotal.subtract(discount).max(BigDecimal.ZERO))
                .appliedCouponCode(cart.getCouponCode())
                .build();
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
