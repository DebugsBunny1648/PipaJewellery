package com.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private String id;
    private String parentId;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String bannerUrl;
    private Integer sortOrder;
    private boolean active;
    private List<CategoryResponse> children;
}
