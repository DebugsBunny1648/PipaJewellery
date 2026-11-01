package com.ecommerce.service;

import com.ecommerce.entity.Notification;
import java.util.List;

public interface NotificationService {
    List<Notification> getForCustomer(String customerId);
    Notification markRead(String id);
    Notification broadcast(Notification notification);
}
