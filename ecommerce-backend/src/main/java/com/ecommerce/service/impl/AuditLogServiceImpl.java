package com.ecommerce.service.impl;

import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.entity.AuditLog;
import com.ecommerce.repository.AuditLogRepository;
import com.ecommerce.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public PageResponse<AuditLog> getAll(int page, int size) {
        return PageResponse.from(auditLogRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @Override
    public void record(String performedBy, String performedByType, String action, String entityName,
                        String entityId, String oldValue, String newValue, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setPerformedBy(performedBy);
        log.setPerformedByType(performedByType);
        log.setAction(action);
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setIpAddress(ipAddress);
        auditLogRepository.save(log);
    }
}
