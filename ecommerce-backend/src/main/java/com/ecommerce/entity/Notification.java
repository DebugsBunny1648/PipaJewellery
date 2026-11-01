package com.ecommerce.entity;

import com.ecommerce.constant.NotificationType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "notifications")
public class Notification extends BaseEntity {

    @Indexed
    private String customerId;   // null => broadcast

    private NotificationType type;
    private String title;
    private String message;

    private boolean read = false;
    private String linkUrl;
}
