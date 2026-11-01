package com.ecommerce.entity;

import com.ecommerce.constant.OrderStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "orders")
public class Order extends BaseEntity {

    @Indexed(unique = true)
    private String orderNumber;

    @Indexed
    private String customerId;

    private OrderStatus status = OrderStatus.PENDING;

    private ShippingSnapshot shippingAddress;

    private BigDecimal subtotal;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private BigDecimal shippingCharge = BigDecimal.ZERO;
    private BigDecimal totalAmount;

    private String couponId;
    private String customerNote;

    private List<OrderItem> items = new ArrayList<>();
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();

    private Payment payment;
    private Shipping shipping;
}
