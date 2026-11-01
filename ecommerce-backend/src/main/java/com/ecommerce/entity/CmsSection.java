package com.ecommerce.entity;

import com.ecommerce.constant.CmsSectionType;
import com.ecommerce.constant.DeviceVisibility;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * A single configurable block on the homepage (or other CMS-driven surfaces).
 * The website and mobile app render these dynamically based on `sectionType`
 * and the free-form `metadataJson` payload.
 */
@Getter
@Setter
@Document(collection = "cms_sections")
public class CmsSection extends BaseEntity {

    private String sectionName;
    private CmsSectionType sectionType;

    private String title;
    private String subtitle;
    private String description;

    private String imageUrl;
    private String mobileImageUrl;

    private String ctaText;
    private String ctaLink;

    private String linkedCategoryId;
    private String linkedProductId;
    private String linkedCollection;

    private Integer sortOrder = 0;
    private DeviceVisibility deviceVisibility = DeviceVisibility.BOTH;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String backgroundColor;
    private String textColor;
    private String layoutType;

    private String metadataJson;
}
