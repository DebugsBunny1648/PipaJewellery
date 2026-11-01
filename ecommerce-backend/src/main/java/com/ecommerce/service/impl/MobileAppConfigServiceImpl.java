package com.ecommerce.service.impl;

import com.ecommerce.entity.MobileAppConfig;
import com.ecommerce.repository.MobileAppConfigRepository;
import com.ecommerce.service.MobileAppConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MobileAppConfigServiceImpl implements MobileAppConfigService {

    private final MobileAppConfigRepository mobileAppConfigRepository;

    @Override
    public MobileAppConfig getConfig() {
        return mobileAppConfigRepository.findAll().stream()
                .filter(c -> !c.isDeleted())
                .findFirst()
                .orElseGet(() -> {
                    MobileAppConfig config = new MobileAppConfig();
                    config.setAppName("Ecommerce App");
                    return mobileAppConfigRepository.save(config);
                });
    }

    @Override
    public MobileAppConfig update(MobileAppConfig config) {
        MobileAppConfig existing = getConfig();
        config.setId(existing.getId());
        return mobileAppConfigRepository.save(config);
    }
}
