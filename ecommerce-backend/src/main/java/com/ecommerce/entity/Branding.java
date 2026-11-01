package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "branding")
public class Branding extends BaseEntity {

    private String platform; // WEB, MOBILE, BOTH
    private String siteName;
    private String tagline;

    private String logoUrl;
    private String faviconUrl;
    private String darkModeLogoUrl;

    private String primaryColor;
    private String secondaryColor;
    private String accentColor;
    private String fontFamily;
}
