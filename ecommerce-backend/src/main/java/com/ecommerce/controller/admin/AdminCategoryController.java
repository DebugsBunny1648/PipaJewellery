package com.ecommerce.controller.admin;

import com.ecommerce.dto.request.CategoryRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.CategoryResponse;
import com.ecommerce.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@Tag(name = "Categories (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','PRODUCT_MANAGER')")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", categoryService.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> update(@PathVariable String id, @Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success("Category updated successfully", categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        categoryService.delete(id);
        return ApiResponse.success("Category deleted successfully", null);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<CategoryResponse> updateStatus(@PathVariable String id, @RequestParam boolean active) {
        return ApiResponse.success("Category status updated", categoryService.updateStatus(id, active));
    }
}
