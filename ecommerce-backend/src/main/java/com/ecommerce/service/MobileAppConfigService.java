package com.ecommerce.service;

import com.ecommerce.entity.MobileAppConfig;

public interface MobileAppConfigService {
    MobileAppConfig getConfig();
    MobileAppConfig update(MobileAppConfig config);
}
