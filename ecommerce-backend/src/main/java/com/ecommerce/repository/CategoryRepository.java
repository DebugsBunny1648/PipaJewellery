package com.ecommerce.repository;

import com.ecommerce.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {

    Optional<Category> findBySlugAndDeletedFalse(String slug);

    List<Category> findByParentIdIsNullAndDeletedFalseOrderBySortOrderAsc();

    List<Category> findByParentIdAndDeletedFalseOrderBySortOrderAsc(String parentId);

    boolean existsBySlug(String slug);
}
