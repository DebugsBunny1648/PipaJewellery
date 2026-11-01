package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Permission;
import com.ecommerce.entity.Role;
import com.ecommerce.service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
@Tag(name = "Roles & Permissions (admin)")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminRoleController {

    private final RoleService roleService;

    @GetMapping
    public ApiResponse<List<Role>> getAll() {
        return ApiResponse.success(roleService.getAll());
    }

    @GetMapping("/permissions")
    public ApiResponse<List<Permission>> getAllPermissions() {
        return ApiResponse.success(roleService.getAllPermissions());
    }

    @PutMapping("/{id}/permissions")
    public ApiResponse<Role> updatePermissions(@PathVariable String id, @RequestBody Set<String> permissionIds) {
        return ApiResponse.success("Permissions updated", roleService.updatePermissions(id, permissionIds));
    }
}
