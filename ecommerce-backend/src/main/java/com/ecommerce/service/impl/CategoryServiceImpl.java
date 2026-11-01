package com.ecommerce.service.impl;

import com.ecommerce.dto.request.CategoryRequest;
import com.ecommerce.dto.response.CategoryResponse;
import com.ecommerce.entity.Category;
import com.ecommerce.exception.DuplicateResourceException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.service.CategoryService;
import com.ecommerce.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getTree() {
        return categoryRepository.findByParentIdIsNullAndDeletedFalseOrderBySortOrderAsc().stream()
                .map(this::toResponseWithChildren)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .filter(c -> !c.isDeleted())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getById(String id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        String slug = (request.getSlug() == null || request.getSlug().isBlank())
                ? SlugUtil.toSlug(request.getName()) : SlugUtil.toSlug(request.getSlug());
        if (categoryRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("A category with slug '" + slug + "' already exists");
        }
        Category category = new Category();
        applyRequest(category, request, slug);
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(String id, CategoryRequest request) {
        Category category = findOrThrow(id);
        String slug = (request.getSlug() == null || request.getSlug().isBlank())
                ? category.getSlug() : SlugUtil.toSlug(request.getSlug());
        applyRequest(category, request, slug);
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void delete(String id) {
        Category category = findOrThrow(id);
        category.setDeleted(true);
        category.setDeletedAt(java.time.LocalDateTime.now());
        categoryRepository.save(category);
    }

    @Override
    public CategoryResponse updateStatus(String id, boolean active) {
        Category category = findOrThrow(id);
        category.setActive(active);
        return toResponse(categoryRepository.save(category));
    }

    private void applyRequest(Category category, CategoryRequest request, String slug) {
        category.setName(request.getName());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setBannerUrl(request.getBannerUrl());
        category.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        category.setSeoTitle(request.getSeoTitle());
        category.setSeoDescription(request.getSeoDescription());

        if (request.getParentId() != null && !request.getParentId().isBlank()) {
            // validate the parent actually exists, but store only its id (no object graph in Mongo)
            findOrThrow(request.getParentId());
            category.setParentId(request.getParentId());
        } else {
            category.setParentId(null);
        }
    }

    private Category findOrThrow(String id) {
        return categoryRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    private CategoryResponse toResponseWithChildren(Category category) {
        CategoryResponse response = toResponse(category);
        List<CategoryResponse> children = categoryRepository
                .findByParentIdAndDeletedFalseOrderBySortOrderAsc(category.getId()).stream()
                .map(this::toResponseWithChildren)
                .collect(Collectors.toList());
        response.setChildren(children);
        return response;
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .parentId(c.getParentId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .imageUrl(c.getImageUrl())
                .bannerUrl(c.getBannerUrl())
                .sortOrder(c.getSortOrder())
                .active(c.isActive())
                .children(List.of())
                .build();
    }
}
