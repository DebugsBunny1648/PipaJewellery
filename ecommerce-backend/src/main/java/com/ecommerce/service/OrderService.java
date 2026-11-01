package com.ecommerce.service;

import com.ecommerce.constant.OrderStatus;
import com.ecommerce.constant.PaymentStatus;
import com.ecommerce.dto.request.CheckoutRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.entity.Payment;
import com.ecommerce.entity.Shipping;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface OrderService {
    OrderResponse checkout(String customerId, CheckoutRequest request);
    OrderResponse getById(String customerId, String orderId);
    OrderResponse getByOrderNumber(String orderNumber);
    PageResponse<OrderResponse> getCustomerOrders(String customerId, int page, int size);
    PageResponse<OrderResponse> getAllOrders(int page, int size);
    OrderResponse updateStatus(String orderId, OrderStatus status, String remarks, String changedBy);
    OrderResponse cancelOrder(String customerId, String orderId);

    // Payment and Shipping are embedded on Order in MongoDB (no separate collections),
    // so their admin operations live here rather than in dedicated services.
    Shipping getShipping(String orderId);
    Shipping updateShipping(String orderId, String carrierName, String trackingNumber, String trackingUrl,
                             String currentStatus, LocalDateTime estimatedDeliveryDate);
    Payment getPayment(String orderId);
    Payment updatePaymentStatus(String orderId, PaymentStatus status, String transactionId);
    Payment refundPayment(String orderId, BigDecimal amount);
}
