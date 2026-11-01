package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.StaticPage;
import com.ecommerce.service.StaticPageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pages")
@RequiredArgsConstructor
@Tag(name = "Static Pages (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CONTENT_MANAGER')")
public class AdminStaticPageController {

    private final StaticPageService staticPageService;

    @GetMapping
    public ApiResponse<List<StaticPage>> getAll() {
        return ApiResponse.success(staticPageService.getAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaticPage>> create(@Valid @RequestBody StaticPage page) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Page created successfully", staticPageService.create(page)));
    }

    @PutMapping("/{id}")
    public ApiResponse<StaticPage> update(@PathVariable String id, @Valid @RequestBody StaticPage page) {
        return ApiResponse.success("Page updated successfully", staticPageService.update(id, page));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        staticPageService.delete(id);
        return ApiResponse.success("Page deleted successfully", null);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<StaticPage> updateStatus(@PathVariable String id, @RequestParam boolean active) {
        return ApiResponse.success("Page status updated", staticPageService.updateStatus(id, active));
    }
}
