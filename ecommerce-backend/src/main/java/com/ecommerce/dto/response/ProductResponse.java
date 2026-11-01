package com.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String slug;
    private String sku;
    private String shortDescription;
    private String longDescription;
    private String categoryId;
    private String categoryName;
    private String subcategoryId;
    private String brand;
    private String collectionName;
    private String productType;
    private String gender;
    private String occasion;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal makingCharges;
    private BigDecimal taxPercentage;
    private BigDecimal finalPrice;
    private String videoUrl;
    private String certificateInfo;
    private boolean featured;
    private boolean newArrival;
    private boolean bestSeller;
    private boolean active;
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
    private Integer stockQuantity;
    private List<String> images;
    private Map<String, String> attributes;
}
