package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.MobileAppConfig;
import com.ecommerce.service.MobileAppConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/mobile-config")
@RequiredArgsConstructor
@Tag(name = "Mobile App Configuration (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminMobileAppConfigController {

    private final MobileAppConfigService mobileAppConfigService;

    @GetMapping
    public ApiResponse<MobileAppConfig> get() {
        return ApiResponse.success(mobileAppConfigService.getConfig());
    }

    @PutMapping
    public ApiResponse<MobileAppConfig> update(@Valid @RequestBody MobileAppConfig config) {
        return ApiResponse.success("Mobile app config updated", mobileAppConfigService.update(config));
    }
}
