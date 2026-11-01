package com.ecommerce.service;

import com.ecommerce.dto.request.CategoryRequest;
import com.ecommerce.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getTree();
    List<CategoryResponse> getAll();
    CategoryResponse getById(String id);
    CategoryResponse create(CategoryRequest request);
    CategoryResponse update(String id, CategoryRequest request);
    void delete(String id);
    CategoryResponse updateStatus(String id, boolean active);
}
