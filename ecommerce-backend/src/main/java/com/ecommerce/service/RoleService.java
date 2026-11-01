package com.ecommerce.service;

import com.ecommerce.entity.Permission;
import com.ecommerce.entity.Role;
import java.util.List;
import java.util.Set;

public interface RoleService {
    List<Role> getAll();
    List<Permission> getAllPermissions();
    Role updatePermissions(String roleId, Set<String> permissionIds);
}
