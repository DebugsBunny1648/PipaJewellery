package com.ecommerce.service.impl;

import com.ecommerce.constant.OrderStatus;
import com.ecommerce.repository.*;
import com.ecommerce.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @Override
    public Map<String, Object> getSummary() {
        var orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED && o.getStatus() != OrderStatus.REFUNDED)
                .map(o -> o.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalOrders", orders.size());
        summary.put("totalRevenue", totalRevenue);
        summary.put("pendingOrders", orders.stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count());
        summary.put("totalProducts", productRepository.count());
        summary.put("totalCustomers", customerRepository.count());
        return summary;
    }
}
