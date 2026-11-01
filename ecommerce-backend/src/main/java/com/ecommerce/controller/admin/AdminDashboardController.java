package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard & Reports (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','ORDER_MANAGER','PRODUCT_MANAGER')")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ApiResponse<Map<String, Object>> getSummary() {
        return ApiResponse.success(dashboardService.getSummary());
    }
}
