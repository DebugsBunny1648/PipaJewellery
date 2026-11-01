package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Notification;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<Notification>> getMine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(notificationService.getForCustomer(principal.getId()));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Notification> markRead(@PathVariable String id) {
        return ApiResponse.success(notificationService.markRead(id));
    }
}
