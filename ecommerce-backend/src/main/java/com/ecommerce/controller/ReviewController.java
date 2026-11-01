package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Review;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ApiResponse<List<Review>> getByProduct(@PathVariable String productId) {
        return ApiResponse.success(reviewService.getByProduct(productId));
    }

    @PostMapping("/product/{productId}")
    public ApiResponse<Review> create(@AuthenticationPrincipal UserPrincipal principal,
                                       @PathVariable String productId,
                                       @RequestParam int rating,
                                       @RequestParam(required = false) String title,
                                       @RequestParam(required = false) String comment) {
        Review review = reviewService.create(principal.getId(), productId, rating, title, comment);
        return ApiResponse.success("Review submitted and is pending approval", review);
    }
}
