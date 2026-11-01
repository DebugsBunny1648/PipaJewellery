package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.SiteConfig;
import com.ecommerce.service.SiteConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
@Tag(name = "Site Configuration (admin)")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminSiteConfigController {

    private final SiteConfigService siteConfigService;

    @GetMapping
    public ApiResponse<List<SiteConfig>> getAll() {
        return ApiResponse.success(siteConfigService.getAll());
    }

    @PutMapping
    public ApiResponse<SiteConfig> upsert(@RequestParam String key, @RequestParam String value,
                                           @RequestParam(required = false) String group,
                                           @RequestParam(required = false) String description) {
        return ApiResponse.success("Config saved", siteConfigService.upsert(key, value, group, description));
    }

    @DeleteMapping("/{key}")
    public ApiResponse<Void> delete(@PathVariable String key) {
        siteConfigService.delete(key);
        return ApiResponse.success("Config removed", null);
    }
}
