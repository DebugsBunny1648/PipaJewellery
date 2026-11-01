package com.ecommerce.controller.admin;

import com.ecommerce.dto.request.CmsSectionRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.CmsSectionResponse;
import com.ecommerce.service.CmsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cms")
@RequiredArgsConstructor
@Tag(name = "CMS (admin)", description = "Manage homepage sections/blocks")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CONTENT_MANAGER')")
public class AdminCmsController {

    private final CmsService cmsService;

    @GetMapping("/sections")
    public ApiResponse<List<CmsSectionResponse>> getAll() {
        return ApiResponse.success(cmsService.getAllForAdmin());
    }

    @PostMapping("/sections")
    public ResponseEntity<ApiResponse<CmsSectionResponse>> create(@Valid @RequestBody CmsSectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Section created successfully", cmsService.create(request)));
    }

    @PutMapping("/sections/{id}")
    public ApiResponse<CmsSectionResponse> update(@PathVariable String id, @Valid @RequestBody CmsSectionRequest request) {
        return ApiResponse.success("Section updated successfully", cmsService.update(id, request));
    }

    @DeleteMapping("/sections/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        cmsService.delete(id);
        return ApiResponse.success("Section deleted successfully", null);
    }

    @PatchMapping("/sections/{id}/status")
    public ApiResponse<CmsSectionResponse> updateStatus(@PathVariable String id, @RequestParam boolean active) {
        return ApiResponse.success("Section status updated", cmsService.updateStatus(id, active));
    }

    @PatchMapping("/sections/reorder")
    public ApiResponse<Void> reorder(@RequestBody List<String> orderedSectionIds) {
        cmsService.reorder(orderedSectionIds);
        return ApiResponse.success("Sections reordered successfully", null);
    }
}
