package com.ecommerce.dto.request;

import com.ecommerce.constant.CmsSectionType;
import com.ecommerce.constant.DeviceVisibility;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CmsSectionRequest {

    private String sectionName;

    @NotNull(message = "Section type is required")
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
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String backgroundColor;
    private String textColor;
    private String layoutType;
    private String metadataJson;
}
