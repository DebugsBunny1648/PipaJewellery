package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "static_pages")
public class StaticPage extends BaseEntity {

    private String title;

    @Indexed(unique = true)
    private String slug;

    private String content;
    private String bannerImageUrl;

    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
}
