package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.entity.AuditLog;
import com.ecommerce.service.AuditLogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit & Activity Log (admin)")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminAuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ApiResponse<PageResponse<AuditLog>> getAll(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.success(auditLogService.getAll(page, size));
    }
}
