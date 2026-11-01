package com.ecommerce.controller.admin;

import com.ecommerce.constant.PaymentStatus;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Payment;
import com.ecommerce.entity.Shipping;
import com.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Shipping + Payment are embedded on Order in MongoDB, so both admin operations here
 *  delegate to OrderService rather than dedicated Shipping/Payment services. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Shipping & Payments (admin)")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','ORDER_MANAGER')")
public class AdminFulfillmentController {

    private final OrderService orderService;

    @GetMapping("/orders/{orderId}/shipping")
    public ApiResponse<Shipping> getShipping(@PathVariable String orderId) {
        return ApiResponse.success(orderService.getShipping(orderId));
    }

    @PutMapping("/orders/{orderId}/shipping")
    public ApiResponse<Shipping> updateShipping(@PathVariable String orderId,
                                                 @RequestParam String carrierName,
                                                 @RequestParam String trackingNumber,
                                                 @RequestParam(required = false) String trackingUrl,
                                                 @RequestParam String currentStatus,
                                                 @RequestParam(required = false) LocalDateTime estimatedDeliveryDate) {
        return ApiResponse.success("Shipping info updated", orderService.updateShipping(
                orderId, carrierName, trackingNumber, trackingUrl, currentStatus, estimatedDeliveryDate));
    }

    @GetMapping("/orders/{orderId}/payment")
    public ApiResponse<Payment> getPayment(@PathVariable String orderId) {
        return ApiResponse.success(orderService.getPayment(orderId));
    }

    @PatchMapping("/orders/{orderId}/payment/status")
    public ApiResponse<Payment> updatePaymentStatus(@PathVariable String orderId,
                                                     @RequestParam PaymentStatus status,
                                                     @RequestParam(required = false) String transactionId) {
        return ApiResponse.success("Payment status updated",
                orderService.updatePaymentStatus(orderId, status, transactionId));
    }

    @PostMapping("/orders/{orderId}/payment/refund")
    public ApiResponse<Payment> refund(@PathVariable String orderId, @RequestParam BigDecimal amount) {
        return ApiResponse.success("Refund processed", orderService.refundPayment(orderId, amount));
    }
}
