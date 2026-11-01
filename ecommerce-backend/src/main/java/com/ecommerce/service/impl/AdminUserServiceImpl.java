package com.ecommerce.service.impl;

import com.ecommerce.entity.AdminUser;
import com.ecommerce.entity.Role;
import com.ecommerce.exception.DuplicateResourceException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AdminUserRepository;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<AdminUser> getAll() {
        return adminUserRepository.findAll().stream().filter(a -> !a.isDeleted()).toList();
    }

    @Override
    public AdminUser getById(String id) {
        return find(id);
    }

    @Override
    public AdminUser create(AdminUser adminUser, String rawPassword, String roleId) {
        if (adminUserRepository.existsByUsername(adminUser.getUsername())) {
            throw new DuplicateResourceException("Username already taken");
        }
        if (adminUserRepository.existsByEmail(adminUser.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));
        adminUser.setRoleId(role.getId());
        adminUser.setPassword(passwordEncoder.encode(rawPassword));
        return adminUserRepository.save(adminUser);
    }

    @Override
    public AdminUser update(String id, AdminUser adminUser, String roleId) {
        AdminUser existing = find(id);
        existing.setFullName(adminUser.getFullName());
        existing.setPhone(adminUser.getPhone());
        existing.setAvatarUrl(adminUser.getAvatarUrl());
        if (roleId != null) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));
            existing.setRoleId(role.getId());
        }
        return adminUserRepository.save(existing);
    }

    @Override
    public void delete(String id) {
        AdminUser adminUser = find(id);
        adminUser.setDeleted(true);
        adminUserRepository.save(adminUser);
    }

    @Override
    public AdminUser updateStatus(String id, boolean active) {
        AdminUser adminUser = find(id);
        adminUser.setActive(active);
        return adminUserRepository.save(adminUser);
    }

    private AdminUser find(String id) {
        return adminUserRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user", "id", id));
    }
}
