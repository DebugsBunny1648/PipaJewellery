package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products (public)", description = "Browse, search and filter the catalog")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(productService.search(keyword, categoryId, productType, minPrice, maxPrice,
                color, material, occasion, gender, inStockOnly, sortBy, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getById(@PathVariable String id) {
        return ApiResponse.success(productService.getById(id));
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<ProductResponse> getBySlug(@PathVariable String slug) {
        return ApiResponse.success(productService.getBySlug(slug));
    }

    @GetMapping("/featured")
    public ApiResponse<List<ProductResponse>> getFeatured() {
        return ApiResponse.success(productService.getFeatured());
    }

    @GetMapping("/new-arrivals")
    public ApiResponse<List<ProductResponse>> getNewArrivals() {
        return ApiResponse.success(productService.getNewArrivals());
    }

    @GetMapping("/best-sellers")
    public ApiResponse<List<ProductResponse>> getBestSellers() {
        return ApiResponse.success(productService.getBestSellers());
    }

    @GetMapping("/{id}/related")
    public ApiResponse<List<ProductResponse>> getRelated(@PathVariable String id) {
        return ApiResponse.success(productService.getRelated(id));
    }
}
