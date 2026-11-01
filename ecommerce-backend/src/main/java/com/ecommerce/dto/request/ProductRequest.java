package com.ecommerce.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String slug;   // auto-generated from name if blank

    @NotBlank(message = "SKU is required")
    private String sku;

    private String shortDescription;
    private String longDescription;

    @NotNull(message = "Category is required")
    private String categoryId;
    private String subcategoryId;

    private String brand;
    private String collectionName;
    private String productType;
    private String gender;
    private String occasion;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must not be negative")
    private BigDecimal price;

    private BigDecimal discountPrice;
    private BigDecimal makingCharges;
    private BigDecimal taxPercentage;

    private String videoUrl;
    private String certificateInfo;

    private boolean featured;
    private boolean newArrival;
    private boolean bestSeller;

    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;

    private Integer initialStockQuantity;
    private Integer lowStockThreshold;

    /** Dynamic attribute values, e.g. {"Material": "Gold", "Purity": "22K", "Weight": "8.5g"} */
    private Map<String, String> attributes;
}
