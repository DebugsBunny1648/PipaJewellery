package com.ecommerce.service.impl;

import com.ecommerce.constant.DeviceVisibility;
import com.ecommerce.dto.request.CmsSectionRequest;
import com.ecommerce.dto.response.CmsSectionResponse;
import com.ecommerce.entity.CmsSection;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.CmsSectionRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CmsServiceImpl implements CmsService {

    private final CmsSectionRepository cmsSectionRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CmsSectionResponse> getHomepage(DeviceVisibility device) {
        List<DeviceVisibility> visibilities = device == null
                ? List.of(DeviceVisibility.WEB, DeviceVisibility.MOBILE, DeviceVisibility.BOTH)
                : List.of(device, DeviceVisibility.BOTH);

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        return cmsSectionRepository
                .findByActiveTrueAndDeletedFalseAndDeviceVisibilityInOrderBySortOrderAsc(visibilities)
                .stream()
                .filter(s -> (s.getStartDate() == null || !now.isBefore(s.getStartDate()))
                        && (s.getEndDate() == null || !now.isAfter(s.getEndDate())))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CmsSectionResponse> getAllForAdmin() {
        return cmsSectionRepository.findAll().stream()
                .filter(s -> !s.isDeleted())
                .sorted(Comparator.comparing(CmsSection::getSortOrder))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CmsSectionResponse create(CmsSectionRequest request) {
        CmsSection section = new CmsSection();
        applyRequest(section, request);
        return toResponse(cmsSectionRepository.save(section));
    }

    @Override
    public CmsSectionResponse update(String id, CmsSectionRequest request) {
        CmsSection section = findOrThrow(id);
        applyRequest(section, request);
        return toResponse(cmsSectionRepository.save(section));
    }

    @Override
    public void delete(String id) {
        CmsSection section = findOrThrow(id);
        section.setDeleted(true);
        section.setDeletedAt(java.time.LocalDateTime.now());
        cmsSectionRepository.save(section);
    }

    @Override
    public CmsSectionResponse updateStatus(String id, boolean active) {
        CmsSection section = findOrThrow(id);
        section.setActive(active);
        return toResponse(cmsSectionRepository.save(section));
    }

    @Override
    public void reorder(List<String> orderedSectionIds) {
        for (int i = 0; i < orderedSectionIds.size(); i++) {
            CmsSection section = findOrThrow(orderedSectionIds.get(i));
            section.setSortOrder(i);
            cmsSectionRepository.save(section);
        }
    }

    private void applyRequest(CmsSection section, CmsSectionRequest request) {
        section.setSectionName(request.getSectionName());
        section.setSectionType(request.getSectionType());
        section.setTitle(request.getTitle());
        section.setSubtitle(request.getSubtitle());
        section.setDescription(request.getDescription());
        section.setImageUrl(request.getImageUrl());
        section.setMobileImageUrl(request.getMobileImageUrl());
        section.setCtaText(request.getCtaText());
        section.setCtaLink(request.getCtaLink());
        section.setLinkedCollection(request.getLinkedCollection());
        section.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        section.setDeviceVisibility(request.getDeviceVisibility() == null
                ? com.ecommerce.constant.DeviceVisibility.BOTH : request.getDeviceVisibility());
        section.setStartDate(request.getStartDate());
        section.setEndDate(request.getEndDate());
        section.setBackgroundColor(request.getBackgroundColor());
        section.setTextColor(request.getTextColor());
        section.setLayoutType(request.getLayoutType());
        section.setMetadataJson(request.getMetadataJson());

        if (request.getLinkedCategoryId() != null && !request.getLinkedCategoryId().isBlank()) {
            categoryRepository.findById(request.getLinkedCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getLinkedCategoryId()));
            section.setLinkedCategoryId(request.getLinkedCategoryId());
        } else {
            section.setLinkedCategoryId(null);
        }
        if (request.getLinkedProductId() != null && !request.getLinkedProductId().isBlank()) {
            productRepository.findById(request.getLinkedProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getLinkedProductId()));
            section.setLinkedProductId(request.getLinkedProductId());
        } else {
            section.setLinkedProductId(null);
        }
    }

    private CmsSection findOrThrow(String id) {
        return cmsSectionRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("CMS section", "id", id));
    }

    private CmsSectionResponse toResponse(CmsSection s) {
        return CmsSectionResponse.builder()
                .id(s.getId())
                .sectionName(s.getSectionName())
                .sectionType(s.getSectionType())
                .title(s.getTitle())
                .subtitle(s.getSubtitle())
                .description(s.getDescription())
                .imageUrl(s.getImageUrl())
                .mobileImageUrl(s.getMobileImageUrl())
                .ctaText(s.getCtaText())
                .ctaLink(s.getCtaLink())
                .linkedCategoryId(s.getLinkedCategoryId())
                .linkedProductId(s.getLinkedProductId())
                .linkedCollection(s.getLinkedCollection())
                .sortOrder(s.getSortOrder())
                .deviceVisibility(s.getDeviceVisibility())
                .backgroundColor(s.getBackgroundColor())
                .textColor(s.getTextColor())
                .layoutType(s.getLayoutType())
                .metadataJson(s.getMetadataJson())
                .active(s.isActive())
                .build();
    }
}
