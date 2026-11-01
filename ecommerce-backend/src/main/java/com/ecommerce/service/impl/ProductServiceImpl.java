package com.ecommerce.service.impl;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.DuplicateResourceException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductAttributeRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.StorageService;
import com.ecommerce.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final StorageService storageService;
    private final MongoTemplate mongoTemplate;

    @Override
    public PageResponse<ProductResponse> search(String keyword, String categoryId, String productType,
                                                 BigDecimal minPrice, BigDecimal maxPrice,
                                                 String color, String material, String occasion, String gender,
                                                 Boolean inStockOnly, String sortBy,
                                                 int page, int size) {
        Sort sort = switch (sortBy == null ? "newest" : sortBy) {
            case "price_asc" -> Sort.by("finalPrice").ascending();
            case "price_desc" -> Sort.by("finalPrice").descending();
            case "popularity" -> Sort.by("bestSeller").descending();
            default -> Sort.by("createdAt").descending();
        };
        Pageable pageable = PageRequest.of(page, size, sort);

        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("deleted").is(false));
        criteriaList.add(Criteria.where("active").is(true));

        if (keyword != null && !keyword.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("name").regex(keyword, "i"),
                    Criteria.where("shortDescription").regex(keyword, "i"),
                    Criteria.where("brand").regex(keyword, "i")
            ));
        }
        if (categoryId != null && !categoryId.isBlank()) {
            criteriaList.add(Criteria.where("categoryId").is(categoryId));
        }
        if (productType != null && !productType.isBlank()) {
            criteriaList.add(Criteria.where("productType").is(productType));
        }
        if (minPrice != null) {
            criteriaList.add(Criteria.where("finalPrice").gte(minPrice));
        }
        if (maxPrice != null) {
            criteriaList.add(Criteria.where("finalPrice").lte(maxPrice));
        }
        if (occasion != null && !occasion.isBlank()) {
            criteriaList.add(Criteria.where("occasion").is(occasion));
        }
        if (gender != null && !gender.isBlank()) {
            criteriaList.add(Criteria.where("gender").is(gender));
        }
        if (color != null && !color.isBlank()) {
            criteriaList.add(Criteria.where("variants.color").is(color));
        }
        if (material != null && !material.isBlank()) {
            criteriaList.add(Criteria.where("attributeValues")
                    .elemMatch(Criteria.where("attributeName").regex("material", "i")
                            .and("value").regex(material, "i")));
        }
        if (Boolean.TRUE.equals(inStockOnly)) {
            criteriaList.add(Criteria.where("inventory.stockQuantity").gt(0));
        }

        Criteria combined = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));

        long total = mongoTemplate.count(Query.query(combined), Product.class);
        List<Product> content = mongoTemplate.find(Query.query(combined).with(pageable), Product.class);

        Page<Product> productPage = PageableExecutionUtils.getPage(content, pageable, () -> total);
        return PageResponse.from(productPage.map(this::toResponse));
    }

    @Override
    public ProductResponse getById(String id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public ProductResponse getBySlug(String slug) {
        Product product = productRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        return toResponse(product);
    }

    @Override
    public List<ProductResponse> getFeatured() {
        return productRepository.findByFeaturedTrueAndActiveTrueAndDeletedFalse(PageRequest.of(0, 20))
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getNewArrivals() {
        return productRepository.findByNewArrivalTrueAndActiveTrueAndDeletedFalse(PageRequest.of(0, 20))
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getBestSellers() {
        return productRepository.findByBestSellerTrueAndActiveTrueAndDeletedFalse(PageRequest.of(0, 20))
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getRelated(String productId) {
        Product product = findOrThrow(productId);
        return productRepository.findByCategoryIdAndActiveTrueAndDeletedFalse(
                        product.getCategoryId(), PageRequest.of(0, 8))
                .stream()
                .filter(p -> !p.getId().equals(productId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("A product with SKU '" + request.getSku() + "' already exists");
        }
        String slug = (request.getSlug() == null || request.getSlug().isBlank())
                ? SlugUtil.toSlug(request.getName()) : SlugUtil.toSlug(request.getSlug());
        if (productRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Product product = new Product();
        applyRequest(product, request, slug);

        Inventory inventory = new Inventory();
        inventory.setStockQuantity(request.getInitialStockQuantity() == null ? 0 : request.getInitialStockQuantity());
        inventory.setLowStockThreshold(request.getLowStockThreshold() == null ? 5 : request.getLowStockThreshold());
        product.setInventory(inventory);

        product.setAttributeValues(buildAttributeValues(request.getAttributes()));

        return toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse update(String id, ProductRequest request) {
        Product product = findOrThrow(id);
        String slug = (request.getSlug() == null || request.getSlug().isBlank())
                ? product.getSlug() : SlugUtil.toSlug(request.getSlug());
        applyRequest(product, request, slug);

        if (request.getAttributes() != null) {
            product.setAttributeValues(buildAttributeValues(request.getAttributes()));
        }
        return toResponse(productRepository.save(product));
    }

    @Override
    public void delete(String id) {
        Product product = findOrThrow(id);
        product.setDeleted(true);
        product.setDeletedAt(java.time.LocalDateTime.now());
        productRepository.save(product);
    }

    @Override
    public ProductResponse updateStatus(String id, boolean active) {
        Product product = findOrThrow(id);
        product.setActive(active);
        return toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse addImage(String productId, MultipartFile file, boolean isPrimary) {
        Product product = findOrThrow(productId);
        String url = storageService.upload(file, "products");

        boolean makePrimary = isPrimary || product.getImages().isEmpty();
        if (makePrimary) {
            product.getImages().forEach(img -> img.setPrimary(false));
        }

        ProductImage image = new ProductImage();
        image.setImageUrl(url);
        image.setPrimary(makePrimary);
        image.setSortOrder(product.getImages().size());
        product.getImages().add(image);

        return toResponse(productRepository.save(product));
    }

    @Override
    public void deleteImage(String productId, String imageId) {
        Product product = findOrThrow(productId);
        ProductImage toRemove = product.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product image", "id", imageId));

        storageService.delete(toRemove.getImageUrl());
        product.getImages().removeIf(img -> img.getId().equals(imageId));
        productRepository.save(product);
    }

    // ---------------------------------------------------------------------

    private void applyRequest(Product product, ProductRequest request, String slug) {
        product.setName(request.getName());
        product.setSlug(slug);
        product.setSku(request.getSku());
        product.setShortDescription(request.getShortDescription());
        product.setLongDescription(request.getLongDescription());
        product.setBrand(request.getBrand());
        product.setCollectionName(request.getCollectionName());
        product.setProductType(request.getProductType());
        product.setGender(request.getGender());
        product.setOccasion(request.getOccasion());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setMakingCharges(request.getMakingCharges());
        product.setTaxPercentage(request.getTaxPercentage());
        product.setVideoUrl(request.getVideoUrl());
        product.setCertificateInfo(request.getCertificateInfo());
        product.setFeatured(request.isFeatured());
        product.setNewArrival(request.isNewArrival());
        product.setBestSeller(request.isBestSeller());
        product.setSeoTitle(request.getSeoTitle());
        product.setSeoDescription(request.getSeoDescription());
        product.setSeoKeywords(request.getSeoKeywords());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        product.setCategoryId(category.getId());

        if (request.getSubcategoryId() != null && !request.getSubcategoryId().isBlank()) {
            Category subcategory = categoryRepository.findById(request.getSubcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getSubcategoryId()));
            product.setSubcategoryId(subcategory.getId());
        } else {
            product.setSubcategoryId(null);
        }

        // finalPrice = (discountPrice or price) + makingCharges + tax on that base
        BigDecimal base = (request.getDiscountPrice() != null ? request.getDiscountPrice() : request.getPrice())
                .add(request.getMakingCharges() != null ? request.getMakingCharges() : BigDecimal.ZERO);
        BigDecimal taxAmount = request.getTaxPercentage() != null
                ? base.multiply(request.getTaxPercentage()).divide(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;
        product.setFinalPrice(base.add(taxAmount));
    }

    /** Also upserts any never-before-seen attribute name into the ProductAttribute catalog
     *  (so the admin panel can eventually offer it as a suggestion), but the product itself
     *  only stores the denormalized name/value pair — no reference needed to render it. */
    private List<ProductAttributeValue> buildAttributeValues(Map<String, String> attributes) {
        List<ProductAttributeValue> values = new ArrayList<>();
        if (attributes == null) return values;

        List<ProductAttribute> knownAttributes = productAttributeRepository.findAll();
        attributes.forEach((attrName, value) -> {
            boolean known = knownAttributes.stream().anyMatch(a -> a.getName().equalsIgnoreCase(attrName));
            if (!known) {
                ProductAttribute newAttr = new ProductAttribute();
                newAttr.setName(attrName);
                newAttr.setInputType("TEXT");
                newAttr.setApplicableProductType("ALL");
                productAttributeRepository.save(newAttr);
            }
            ProductAttributeValue pav = new ProductAttributeValue();
            pav.setAttributeName(attrName);
            pav.setValue(value);
            values.add(pav);
        });
        return values;
    }

    private Product findOrThrow(String id) {
        return productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    private ProductResponse toResponse(Product p) {
        Map<String, String> attrs = new HashMap<>();
        p.getAttributeValues().forEach(v -> attrs.put(v.getAttributeName(), v.getValue()));

        Category category = p.getCategoryId() != null
                ? categoryRepository.findById(p.getCategoryId()).orElse(null)
                : null;

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .sku(p.getSku())
                .shortDescription(p.getShortDescription())
                .longDescription(p.getLongDescription())
                .categoryId(p.getCategoryId())
                .categoryName(category != null ? category.getName() : null)
                .subcategoryId(p.getSubcategoryId())
                .brand(p.getBrand())
                .collectionName(p.getCollectionName())
                .productType(p.getProductType())
                .gender(p.getGender())
                .occasion(p.getOccasion())
                .price(p.getPrice())
                .discountPrice(p.getDiscountPrice())
                .makingCharges(p.getMakingCharges())
                .taxPercentage(p.getTaxPercentage())
                .finalPrice(p.getFinalPrice())
                .videoUrl(p.getVideoUrl())
                .certificateInfo(p.getCertificateInfo())
                .featured(p.isFeatured())
                .newArrival(p.isNewArrival())
                .bestSeller(p.isBestSeller())
                .active(p.isActive())
                .seoTitle(p.getSeoTitle())
                .seoDescription(p.getSeoDescription())
                .seoKeywords(p.getSeoKeywords())
                .stockQuantity(p.getInventory() != null ? p.getInventory().getStockQuantity() : 0)
                .images(p.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList()))
                .attributes(attrs)
                .build();
    }
}
