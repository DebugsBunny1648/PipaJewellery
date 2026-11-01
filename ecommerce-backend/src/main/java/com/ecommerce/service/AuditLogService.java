package com.ecommerce.service;

import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.entity.AuditLog;

public interface AuditLogService {
    PageResponse<AuditLog> getAll(int page, int size);
    void record(String performedBy, String performedByType, String action, String entityName, String entityId,
                String oldValue, String newValue, String ipAddress);
}
