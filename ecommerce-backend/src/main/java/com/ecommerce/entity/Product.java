package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Generic product document. Jewellery-specific attributes (material, metal type, stone,
 * purity, weight, etc.) are intentionally NOT hardcoded fields — they live in the embedded
 * `attributeValues` list so the same collection serves fashion, electronics, home decor, or
 * any other category without a migration.
 *
 * Images, variants, attribute values, and inventory are embedded directly on the product
 * document (rather than separate collections) since they're always read and almost always
 * written together with the product itself — a natural fit for MongoDB's document model,
 * and it means a product page render is a single document fetch, no joins.
 */
@Getter
@Setter
@Document(collection = "products")
public class Product extends BaseEntity {

    private String name;

    @Indexed(unique = true)
    private String slug;

    @Indexed(unique = true)
    private String sku;

    private String shortDescription;
    private String longDescription;

    @Indexed
    private String categoryId;
    private String subcategoryId;

    private String brand;
    private String collectionName;

    @Indexed
    private String productType;   // JEWELLERY, FASHION, ELECTRONICS, ACCESSORY, HOME_DECOR, BEAUTY, GENERIC ...
    private String gender;
    private String occasion;

    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal makingCharges;
    private BigDecimal taxPercentage;
    private BigDecimal finalPrice;

    private String videoUrl;
    private String certificateInfo;

    private boolean featured = false;
    private boolean newArrival = false;
    private boolean bestSeller = false;

    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;

    private List<ProductImage> images = new ArrayList<>();
    private List<ProductVariant> variants = new ArrayList<>();
    private List<ProductAttributeValue> attributeValues = new ArrayList<>();
    private Inventory inventory = new Inventory();
}
