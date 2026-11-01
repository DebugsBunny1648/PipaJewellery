package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Coupon;
import com.ecommerce.service.CouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons & Offers (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping
    public ApiResponse<List<Coupon>> getAll() {
        return ApiResponse.success(couponService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Coupon> getById(@PathVariable String id) {
        return ApiResponse.success(couponService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Coupon>> create(@Valid @RequestBody Coupon coupon) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Coupon created", couponService.create(coupon)));
    }

    @PutMapping("/{id}")
    public ApiResponse<Coupon> update(@PathVariable String id, @Valid @RequestBody Coupon coupon) {
        return ApiResponse.success("Coupon updated", couponService.update(id, coupon));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        couponService.delete(id);
        return ApiResponse.success("Coupon deleted", null);
    }
}
