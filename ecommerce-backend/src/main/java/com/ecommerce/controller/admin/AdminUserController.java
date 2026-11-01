package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.AdminUser;
import com.ecommerce.service.AdminUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin Users (admin)", description = "Manage back-office admin accounts")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<List<AdminUser>> getAll() {
        return ApiResponse.success(adminUserService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminUser> getById(@PathVariable String id) {
        return ApiResponse.success(adminUserService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminUser>> create(@RequestBody AdminUser adminUser,
                                                          @RequestParam String password,
                                                          @RequestParam String roleId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Admin user created", adminUserService.create(adminUser, password, roleId)));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminUser> update(@PathVariable String id, @RequestBody AdminUser adminUser,
                                          @RequestParam(required = false) String roleId) {
        return ApiResponse.success("Admin user updated", adminUserService.update(id, adminUser, roleId));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        adminUserService.delete(id);
        return ApiResponse.success("Admin user deleted", null);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<AdminUser> updateStatus(@PathVariable String id, @RequestParam boolean active) {
        return ApiResponse.success("Status updated", adminUserService.updateStatus(id, active));
    }
}
