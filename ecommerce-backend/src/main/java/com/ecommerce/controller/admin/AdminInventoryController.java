package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Inventory;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Inventory is embedded directly on Product in MongoDB — this controller reads/writes
 *  that embedded field rather than a separate collection. */
@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','PRODUCT_MANAGER')")
public class AdminInventoryController {

    private final ProductRepository productRepository;

    @GetMapping("/product/{productId}")
    public ApiResponse<Inventory> getByProduct(@PathVariable String productId) {
        return ApiResponse.success(find(productId).getInventory());
    }

    @PutMapping("/product/{productId}")
    public ApiResponse<Inventory> adjustStock(@PathVariable String productId,
                                               @RequestParam Integer stockQuantity,
                                               @RequestParam(required = false) Integer lowStockThreshold,
                                               @RequestParam(required = false) String warehouseLocation) {
        Product product = find(productId);
        Inventory inventory = product.getInventory();
        inventory.setStockQuantity(stockQuantity);
        if (lowStockThreshold != null) inventory.setLowStockThreshold(lowStockThreshold);
        if (warehouseLocation != null) inventory.setWarehouseLocation(warehouseLocation);
        productRepository.save(product);
        return ApiResponse.success("Stock updated", inventory);
    }

    private Product find(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
    }
}
