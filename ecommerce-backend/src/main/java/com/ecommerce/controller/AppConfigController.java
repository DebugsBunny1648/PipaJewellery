package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Branding;
import com.ecommerce.entity.MobileAppConfig;
import com.ecommerce.service.BrandingService;
import com.ecommerce.service.MobileAppConfigService;
import com.ecommerce.service.SiteConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Public, unauthenticated read endpoints the website and mobile app call on startup
 * to fetch branding, general site settings and (for mobile) force-update/maintenance flags.
 */
@RestController
@RequestMapping("/api/app-config")
@RequiredArgsConstructor
@Tag(name = "App Configuration (public)")
public class AppConfigController {

    private final BrandingService brandingService;
    private final MobileAppConfigService mobileAppConfigService;
    private final SiteConfigService siteConfigService;

    @GetMapping("/branding/{platform}")
    public ApiResponse<Branding> getBranding(@PathVariable String platform) {
        return ApiResponse.success(brandingService.getByPlatform(platform));
    }

    @GetMapping("/mobile")
    public ApiResponse<MobileAppConfig> getMobileConfig() {
        return ApiResponse.success(mobileAppConfigService.getConfig());
    }

    @GetMapping("/site")
    public ApiResponse<Map<String, String>> getSiteConfig() {
        return ApiResponse.success(siteConfigService.getPublicConfig());
    }
}
