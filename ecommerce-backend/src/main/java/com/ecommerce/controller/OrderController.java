package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders (customer)")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> myOrders(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(orderService.getCustomerOrders(principal.getId(), page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getById(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id) {
        return ApiResponse.success(orderService.getById(principal.getId(), id));
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<OrderResponse> cancel(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id) {
        return ApiResponse.success("Order cancelled", orderService.cancelOrder(principal.getId(), id));
    }
}
