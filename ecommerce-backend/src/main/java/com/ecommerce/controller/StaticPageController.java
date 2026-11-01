package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.StaticPage;
import com.ecommerce.service.StaticPageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pages")
@RequiredArgsConstructor
@Tag(name = "Static Pages (public)")
public class StaticPageController {

    private final StaticPageService staticPageService;

    @GetMapping("/{slug}")
    public ApiResponse<StaticPage> getBySlug(@PathVariable String slug) {
        return ApiResponse.success(staticPageService.getBySlug(slug));
    }
}
