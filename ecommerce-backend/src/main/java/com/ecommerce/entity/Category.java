package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "categories")
public class Category extends BaseEntity {

    /** Reference to another Category's id, or null for a top-level category. */
    @Indexed
    private String parentId;

    private String name;

    @Indexed(unique = true)
    private String slug;

    private String description;
    private String imageUrl;
    private String bannerUrl;

    private Integer sortOrder = 0;

    private String seoTitle;
    private String seoDescription;
}
