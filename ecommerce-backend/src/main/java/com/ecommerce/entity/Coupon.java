package com.ecommerce.entity;

import com.ecommerce.constant.CouponApplicability;
import com.ecommerce.constant.DiscountType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "coupons")
public class Coupon extends BaseEntity {

    @Indexed(unique = true)
    private String code;

    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderValue;

    private CouponApplicability applicability = CouponApplicability.ALL_PRODUCTS;
    private String applicableCategoryId;
    private String applicableProductId;

    private Integer usageLimitTotal;
    private Integer usageLimitPerCustomer;
    private Integer usedCount = 0;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
