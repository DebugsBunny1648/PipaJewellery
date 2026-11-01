package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "audit_logs")
public class AuditLog extends BaseEntity {

    private String performedBy;
    private String performedByType;  // ADMIN | CUSTOMER | SYSTEM

    private String action;           // CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, etc.
    private String entityName;
    private String entityId;

    private String oldValue;
    private String newValue;

    private String ipAddress;
}
