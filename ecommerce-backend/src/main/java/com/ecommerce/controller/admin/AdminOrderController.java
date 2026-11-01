package com.ecommerce.controller.admin;

import com.ecommerce.constant.OrderStatus;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Orders (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','ORDER_MANAGER')")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> getAll(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(orderService.getAllOrders(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getById(@PathVariable String id) {
        return ApiResponse.success(orderService.getById(null, id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                    @PathVariable String id,
                                                    @RequestParam OrderStatus status,
                                                    @RequestParam(required = false) String remarks) {
        return ApiResponse.success("Order status updated",
                orderService.updateStatus(id, status, remarks, principal.getUsername()));
    }
}
