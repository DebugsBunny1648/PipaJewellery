package com.ecommerce.service.impl;

import com.ecommerce.constant.OrderStatus;
import com.ecommerce.constant.PaymentStatus;
import com.ecommerce.dto.request.CheckoutRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.InsufficientStockException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.CouponRepository;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.OrderService;
import com.ecommerce.util.OrderNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final EmailService emailService;

    @Override
    public OrderResponse checkout(String customerId, CheckoutRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot checkout with an empty cart");
        }

        Address address = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getShippingAddressId()));

        // Load every referenced product up front and validate stock before writing anything.
        java.util.Map<String, Product> productsById = new java.util.HashMap<>();
        for (CartItem item : cart.getItems()) {
            Product product = productsById.computeIfAbsent(item.getProductId(), id -> productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id)));
            Inventory inventory = product.getInventory();
            if (inventory == null || inventory.getStockQuantity() < item.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for '" + product.getName() + "'");
            }
        }

        Order order = new Order();
        order.setOrderNumber(OrderNumberGenerator.generate());
        order.setCustomerId(customer.getId());
        order.setStatus(OrderStatus.PENDING);
        order.setCustomerNote(request.getCustomerNote());

        ShippingSnapshot snapshot = new ShippingSnapshot();
        snapshot.setRecipientName(address.getRecipientName());
        snapshot.setPhone(address.getPhone());
        snapshot.setAddressLine1(address.getAddressLine1());
        snapshot.setAddressLine2(address.getAddressLine2());
        snapshot.setCity(address.getCity());
        snapshot.setState(address.getState());
        snapshot.setCountry(address.getCountry());
        snapshot.setPincode(address.getPincode());
        order.setShippingAddress(snapshot);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = productsById.get(item.getProductId());

            OrderItem oi = new OrderItem();
            oi.setProductId(product.getId());
            oi.setVariantId(item.getVariantId());
            oi.setProductNameSnapshot(product.getName());
            oi.setProductSkuSnapshot(product.getSku());
            oi.setQuantity(item.getQuantity());
            oi.setUnitPrice(item.getPriceAtAddTime());
            BigDecimal lineTotal = item.getPriceAtAddTime().multiply(BigDecimal.valueOf(item.getQuantity()));
            oi.setTotalPrice(lineTotal);
            order.getItems().add(oi);
            subtotal = subtotal.add(lineTotal);

            // deduct stock
            product.getInventory().setStockQuantity(product.getInventory().getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (cart.getCouponId() != null) {
            Coupon coupon = couponRepository.findById(cart.getCouponId()).orElse(null);
            if (coupon != null) {
                order.setCouponId(coupon.getId());
                discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
            }
        }
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discount);
        order.setTaxAmount(BigDecimal.ZERO);
        order.setShippingCharge(BigDecimal.ZERO);
        order.setTotalAmount(subtotal.subtract(discount).max(BigDecimal.ZERO));

        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus(OrderStatus.PENDING);
        history.setRemarks("Order placed");
        order.getStatusHistory().add(history);

        Payment payment = new Payment();
        payment.setMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setAmount(order.getTotalAmount());
        order.setPayment(payment);

        Order saved = orderRepository.save(order);

        // clear the cart post-checkout
        cart.getItems().clear();
        cart.setCouponId(null);
        cart.setCouponCode(null);
        cartRepository.save(cart);

        emailService.sendOrderConfirmationEmail(customer.getEmail(), saved.getOrderNumber());

        return toResponse(saved);
    }

    @Override
    public OrderResponse getById(String customerId, String orderId) {
        Order order = findOrThrow(orderId);
        if (customerId != null && !order.getCustomerId().equals(customerId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }
        return toResponse(order);
    }

    @Override
    public OrderResponse getByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return toResponse(order);
    }

    @Override
    public PageResponse<OrderResponse> getCustomerOrders(String customerId, int page, int size) {
        var result = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, PageRequest.of(page, size))
                .map(this::toResponse);
        return PageResponse.from(result);
    }

    @Override
    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        var result = orderRepository
                .findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toResponse);
        return PageResponse.from(result);
    }

    @Override
    public OrderResponse updateStatus(String orderId, OrderStatus status, String remarks, String changedBy) {
        Order order = findOrThrow(orderId);
        order.setStatus(status);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus(status);
        history.setRemarks(remarks);
        history.setChangedBy(changedBy);
        order.getStatusHistory().add(history);

        return toResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse cancelOrder(String customerId, String orderId) {
        Order order = findOrThrow(orderId);
        if (!order.getCustomerId().equals(customerId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }
        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Order can no longer be cancelled at its current status");
        }
        // restock items
        for (OrderItem item : order.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                if (product.getInventory() != null) {
                    product.getInventory().setStockQuantity(product.getInventory().getStockQuantity() + item.getQuantity());
                    productRepository.save(product);
                }
            });
        }
        return updateStatus(orderId, OrderStatus.CANCELLED, "Cancelled by customer", "CUSTOMER");
    }

    @Override
    public Shipping getShipping(String orderId) {
        Order order = findOrThrow(orderId);
        if (order.getShipping() == null) {
            throw new ResourceNotFoundException("Shipping info not found for order " + orderId);
        }
        return order.getShipping();
    }

    @Override
    public Shipping updateShipping(String orderId, String carrierName, String trackingNumber, String trackingUrl,
                                    String currentStatus, LocalDateTime estimatedDeliveryDate) {
        Order order = findOrThrow(orderId);
        Shipping shipping = order.getShipping() != null ? order.getShipping() : new Shipping();

        shipping.setCarrierName(carrierName);
        shipping.setTrackingNumber(trackingNumber);
        shipping.setTrackingUrl(trackingUrl);
        shipping.setCurrentStatus(currentStatus);
        shipping.setEstimatedDeliveryDate(estimatedDeliveryDate);
        if ("SHIPPED".equalsIgnoreCase(currentStatus)) shipping.setShippedAt(LocalDateTime.now());
        if ("DELIVERED".equalsIgnoreCase(currentStatus)) shipping.setDeliveredAt(LocalDateTime.now());

        order.setShipping(shipping);
        orderRepository.save(order);
        return shipping;
    }

    @Override
    public Payment getPayment(String orderId) {
        Order order = findOrThrow(orderId);
        if (order.getPayment() == null) {
            throw new ResourceNotFoundException("Payment not found for order " + orderId);
        }
        return order.getPayment();
    }

    @Override
    public Payment updatePaymentStatus(String orderId, PaymentStatus status, String transactionId) {
        Order order = findOrThrow(orderId);
        Payment payment = order.getPayment();
        if (payment == null) {
            throw new ResourceNotFoundException("Payment not found for order " + orderId);
        }
        payment.setStatus(status);
        payment.setTransactionId(transactionId);
        if (status == PaymentStatus.PAID) payment.setPaidAt(LocalDateTime.now());
        orderRepository.save(order);
        return payment;
    }

    @Override
    public Payment refundPayment(String orderId, BigDecimal amount) {
        Order order = findOrThrow(orderId);
        Payment payment = order.getPayment();
        if (payment == null) {
            throw new ResourceNotFoundException("Payment not found for order " + orderId);
        }
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundAmount(amount);
        payment.setRefundedAt(LocalDateTime.now());
        orderRepository.save(order);
        return payment;
    }

    private Order findOrThrow(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream().map(i ->
                OrderResponse.OrderItemResponse.builder()
                        .productId(i.getProductId())
                        .productName(i.getProductNameSnapshot())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice())
                        .build()
        ).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .taxAmount(order.getTaxAmount())
                .shippingCharge(order.getShippingCharge())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(items)
                .statusHistory(order.getStatusHistory().stream()
                        .sorted(java.util.Comparator.comparing(OrderStatusHistory::getCreatedAt,
                                java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())))
                        .map(h -> OrderResponse.StatusHistoryEntry.builder()
                                .status(h.getStatus().name())
                                .remarks(h.getRemarks())
                                .changedBy(h.getChangedBy())
                                .createdAt(h.getCreatedAt())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
