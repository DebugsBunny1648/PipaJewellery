package com.ecommerce.service;

import com.ecommerce.entity.SiteConfig;
import java.util.List;
import java.util.Map;

public interface SiteConfigService {
    List<SiteConfig> getAll();
    Map<String, String> getPublicConfig();
    SiteConfig upsert(String key, String value, String group, String description);
    void delete(String key);
}
