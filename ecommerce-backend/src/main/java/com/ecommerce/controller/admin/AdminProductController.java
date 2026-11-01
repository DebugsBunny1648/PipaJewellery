package com.ecommerce.controller.admin;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "Products (admin)", description = "Product CRUD, images and status management")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','PRODUCT_MANAGER')")
public class AdminProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", productService.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> update(@PathVariable String id, @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Product updated successfully", productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        productService.delete(id);
        return ApiResponse.success("Product deleted successfully", null);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ProductResponse> updateStatus(@PathVariable String id, @RequestParam boolean active) {
        return ApiResponse.success("Product status updated", productService.updateStatus(id, active));
    }

    @PostMapping("/{id}/images")
    public ApiResponse<ProductResponse> addImage(@PathVariable String id,
                                                  @RequestParam("file") MultipartFile file,
                                                  @RequestParam(defaultValue = "false") boolean isPrimary) {
        return ApiResponse.success("Image uploaded successfully", productService.addImage(id, file, isPrimary));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ApiResponse<Void> deleteImage(@PathVariable String id, @PathVariable String imageId) {
        productService.deleteImage(id, imageId);
        return ApiResponse.success("Image deleted successfully", null);
    }
}
