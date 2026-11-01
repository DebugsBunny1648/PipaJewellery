package com.ecommerce.service;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    PageResponse<ProductResponse> search(String keyword, String categoryId, String productType,
                                          BigDecimal minPrice, BigDecimal maxPrice,
                                          String color, String material, String occasion, String gender,
                                          Boolean inStockOnly, String sortBy,
                                          int page, int size);

    ProductResponse getById(String id);
    ProductResponse getBySlug(String slug);
    List<ProductResponse> getFeatured();
    List<ProductResponse> getNewArrivals();
    List<ProductResponse> getBestSellers();
    List<ProductResponse> getRelated(String productId);

    ProductResponse create(ProductRequest request);
    ProductResponse update(String id, ProductRequest request);
    void delete(String id);
    ProductResponse updateStatus(String id, boolean active);

    ProductResponse addImage(String productId, MultipartFile file, boolean isPrimary);
    void deleteImage(String productId, String imageId);
}
