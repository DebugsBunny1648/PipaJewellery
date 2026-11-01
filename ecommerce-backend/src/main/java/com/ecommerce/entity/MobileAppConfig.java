package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "mobile_app_config")
public class MobileAppConfig extends BaseEntity {

    private String appName;
    private String appVersionAndroid;
    private String appVersionIos;

    private boolean forceUpdateAndroid = false;
    private boolean forceUpdateIos = false;

    private String androidStoreUrl;
    private String iosStoreUrl;

    private boolean maintenanceMode = false;
    private String maintenanceMessage;

    private String splashScreenImageUrl;
    private String onboardingConfigJson;
}
