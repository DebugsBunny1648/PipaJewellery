package com.ecommerce.service.impl;

import com.ecommerce.entity.Permission;
import com.ecommerce.entity.Role;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.PermissionRepository;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    @Override
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @Override
    public Role updatePermissions(String roleId, Set<String> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));
        // Validate every id actually resolves to a real permission before assigning.
        Set<String> validIds = new HashSet<>();
        permissionRepository.findAllById(permissionIds).forEach(p -> validIds.add(p.getId()));
        role.setPermissionIds(validIds);
        return roleRepository.save(role);
    }
}
