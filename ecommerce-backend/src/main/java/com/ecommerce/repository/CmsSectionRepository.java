package com.ecommerce.repository;

import com.ecommerce.constant.DeviceVisibility;
import com.ecommerce.entity.CmsSection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CmsSectionRepository extends MongoRepository<CmsSection, String> {

    List<CmsSection> findByActiveTrueAndDeletedFalseAndDeviceVisibilityInOrderBySortOrderAsc(
            List<DeviceVisibility> visibilities);
}
