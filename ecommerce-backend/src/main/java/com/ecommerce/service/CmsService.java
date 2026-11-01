package com.ecommerce.service;

import com.ecommerce.constant.DeviceVisibility;
import com.ecommerce.dto.request.CmsSectionRequest;
import com.ecommerce.dto.response.CmsSectionResponse;

import java.util.List;

public interface CmsService {
    List<CmsSectionResponse> getHomepage(DeviceVisibility device);
    List<CmsSectionResponse> getAllForAdmin();
    CmsSectionResponse create(CmsSectionRequest request);
    CmsSectionResponse update(String id, CmsSectionRequest request);
    void delete(String id);
    CmsSectionResponse updateStatus(String id, boolean active);
    void reorder(List<String> orderedSectionIds);
}
