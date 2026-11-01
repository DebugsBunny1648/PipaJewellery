package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.CategoryResponse;
import com.ecommerce.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories (public)")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.success(categoryService.getAll());
    }

    @GetMapping("/tree")
    public ApiResponse<List<CategoryResponse>> getTree() {
        return ApiResponse.success(categoryService.getTree());
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getById(@PathVariable String id) {
        return ApiResponse.success(categoryService.getById(id));
    }
}
