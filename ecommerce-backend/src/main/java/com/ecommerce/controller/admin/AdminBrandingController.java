package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Branding;
import com.ecommerce.service.BrandingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/branding")
@RequiredArgsConstructor
@Tag(name = "Branding & Logos (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CONTENT_MANAGER')")
public class AdminBrandingController {

    private final BrandingService brandingService;

    @GetMapping
    public ApiResponse<List<Branding>> getAll() {
        return ApiResponse.success(brandingService.getAll());
    }

    @GetMapping("/{platform}")
    public ApiResponse<Branding> getByPlatform(@PathVariable String platform) {
        return ApiResponse.success(brandingService.getByPlatform(platform));
    }

    @PutMapping
    public ApiResponse<Branding> upsert(@Valid @RequestBody Branding branding) {
        return ApiResponse.success("Branding saved", brandingService.upsert(branding));
    }
}
