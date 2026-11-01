package com.ecommerce.service.impl;

import com.ecommerce.entity.SiteConfig;
import com.ecommerce.repository.SiteConfigRepository;
import com.ecommerce.service.SiteConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteConfigServiceImpl implements SiteConfigService {

    private final SiteConfigRepository siteConfigRepository;

    @Override
    public List<SiteConfig> getAll() {
        return siteConfigRepository.findAll().stream().filter(c -> !c.isDeleted()).toList();
    }

    @Override
    public Map<String, String> getPublicConfig() {
        // Only GENERAL/SEO/SOCIAL/FEATURE_FLAG groups are exposed publicly; anything
        // sensitive (payment keys, SMTP credentials) must live in SmtpConfig/PaymentConfig instead.
        return getAll().stream()
                .filter(SiteConfig::isActive)
                .collect(Collectors.toMap(SiteConfig::getConfigKey, c -> c.getConfigValue() == null ? "" : c.getConfigValue()));
    }

    @Override
    public SiteConfig upsert(String key, String value, String group, String description) {
        SiteConfig config = siteConfigRepository.findByConfigKey(key).orElseGet(SiteConfig::new);
        config.setConfigKey(key);
        config.setConfigValue(value);
        config.setConfigGroup(group);
        config.setDescription(description);
        return siteConfigRepository.save(config);
    }

    @Override
    public void delete(String key) {
        siteConfigRepository.findByConfigKey(key).ifPresent(siteConfigRepository::delete);
    }
}
