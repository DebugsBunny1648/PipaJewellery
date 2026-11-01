package com.ecommerce.service.impl;

import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.WishlistRepository;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Override
    public List<ProductResponse> getWishlist(String customerId) {
        return wishlistRepository.findByCustomerId(customerId)
                .map(w -> w.getProductIds().stream()
                        .map(productService::getById)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    @Override
    public void addToWishlist(String customerId, String productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
        Wishlist wishlist = resolveWishlist(customerId, true);
        if (!wishlist.getProductIds().contains(productId)) {
            wishlist.getProductIds().add(productId);
            wishlistRepository.save(wishlist);
        }
    }

    @Override
    public void removeFromWishlist(String customerId, String productId) {
        wishlistRepository.findByCustomerId(customerId).ifPresent(wishlist -> {
            if (wishlist.getProductIds().remove(productId)) {
                wishlistRepository.save(wishlist);
            }
        });
    }

    private Wishlist resolveWishlist(String customerId, boolean createIfMissing) {
        return wishlistRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    if (!createIfMissing) {
                        Wishlist empty = new Wishlist();
                        empty.setCustomerId(customerId);
                        empty.setProductIds(new ArrayList<>());
                        return empty;
                    }
                    if (!customerRepository.existsById(customerId)) {
                        throw new ResourceNotFoundException("Customer", "id", customerId);
                    }
                    Wishlist wishlist = new Wishlist();
                    wishlist.setCustomerId(customerId);
                    return wishlistRepository.save(wishlist);
                });
    }
}
