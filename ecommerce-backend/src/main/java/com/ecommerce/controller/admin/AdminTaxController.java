package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Tax;
import com.ecommerce.service.TaxService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/taxes")
@RequiredArgsConstructor
@Tag(name = "Tax (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminTaxController {

    private final TaxService taxService;

    @GetMapping
    public ApiResponse<List<Tax>> getAll() {
        return ApiResponse.success(taxService.getAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Tax>> create(@Valid @RequestBody Tax tax) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tax rule created", taxService.create(tax)));
    }

    @PutMapping("/{id}")
    public ApiResponse<Tax> update(@PathVariable String id, @Valid @RequestBody Tax tax) {
        return ApiResponse.success("Tax rule updated", taxService.update(id, tax));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        taxService.delete(id);
        return ApiResponse.success("Tax rule deleted", null);
    }
}
