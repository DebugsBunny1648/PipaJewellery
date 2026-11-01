package com.ecommerce.service;

import com.ecommerce.entity.AdminUser;
import java.util.List;

public interface AdminUserService {
    List<AdminUser> getAll();
    AdminUser getById(String id);
    AdminUser create(AdminUser adminUser, String rawPassword, String roleId);
    AdminUser update(String id, AdminUser adminUser, String roleId);
    void delete(String id);
    AdminUser updateStatus(String id, boolean active);
}
