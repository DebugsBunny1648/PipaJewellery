package com.ecommerce.service.impl;

import com.ecommerce.entity.Notification;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.NotificationRepository;
import com.ecommerce.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<Notification> getForCustomer(String customerId) {
        return notificationRepository.findAll().stream()
                .filter(n -> !n.isDeleted() && (n.getCustomerId() == null || n.getCustomerId().equals(customerId)))
                .toList();
    }

    @Override
    public Notification markRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public Notification broadcast(Notification notification) {
        notification.setCustomerId(null);
        return notificationRepository.save(notification);
    }
}
