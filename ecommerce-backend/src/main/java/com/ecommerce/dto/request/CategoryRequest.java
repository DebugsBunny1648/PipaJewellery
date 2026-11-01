package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    private String parentId;

    @NotBlank(message = "Category name is required")
    private String name;

    private String slug;
    private String description;
    private String imageUrl;
    private String bannerUrl;
    private Integer sortOrder;
    private String seoTitle;
    private String seoDescription;
}
