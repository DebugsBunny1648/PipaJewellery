package com.ecommerce.controller.admin;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Review;
import com.ecommerce.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews (admin)", description = "Moderate customer reviews")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CONTENT_MANAGER')")
public class AdminReviewController {

    private final ReviewService reviewService;

    @PatchMapping("/{id}/approve")
    public ApiResponse<Review> approve(@PathVariable String id, @RequestParam boolean approved) {
        return ApiResponse.success("Review moderation updated", reviewService.approve(id, approved));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        reviewService.delete(id);
        return ApiResponse.success("Review deleted", null);
    }
}
