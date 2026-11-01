package com.ecommerce.dto.response;

import com.ecommerce.constant.CmsSectionType;
import com.ecommerce.constant.DeviceVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CmsSectionResponse {
    private String id;
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
    private Integer sortOrder;
    private DeviceVisibility deviceVisibility;
    private String backgroundColor;
    private String textColor;
    private String layoutType;
    private String metadataJson;
    private boolean active;
}
