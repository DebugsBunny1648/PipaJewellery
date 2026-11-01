package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "site_configs")
public class SiteConfig extends BaseEntity {

    @Indexed(unique = true)
    private String configKey;

    private String configValue;
    private String configGroup;   // GENERAL, SEO, SOCIAL, FEATURE_FLAG
    private String description;
}
