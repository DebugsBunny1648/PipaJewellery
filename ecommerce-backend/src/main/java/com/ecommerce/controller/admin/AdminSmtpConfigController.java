package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.SmtpConfig;
import com.ecommerce.service.SmtpConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/smtp-config")
@RequiredArgsConstructor
@Tag(name = "SMTP Configuration (admin)")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminSmtpConfigController {

    private final SmtpConfigService smtpConfigService;

    @GetMapping
    public ApiResponse<List<SmtpConfig>> getAll() {
        return ApiResponse.success(smtpConfigService.getAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SmtpConfig>> create(@Valid @RequestBody SmtpConfig config) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("SMTP config created", smtpConfigService.create(config)));
    }

    @PutMapping("/{id}")
    public ApiResponse<SmtpConfig> update(@PathVariable String id, @Valid @RequestBody SmtpConfig config) {
        return ApiResponse.success("SMTP config updated", smtpConfigService.update(id, config));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        smtpConfigService.delete(id);
        return ApiResponse.success("SMTP config deleted", null);
    }

    @PostMapping("/{id}/test")
    public ApiResponse<Void> test(@PathVariable String id, @RequestParam String toEmail) {
        smtpConfigService.sendTestEmail(id, toEmail);
        return ApiResponse.success("Test email dispatched", null);
    }
}
