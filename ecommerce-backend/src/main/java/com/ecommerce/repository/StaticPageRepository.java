package com.ecommerce.repository;

import com.ecommerce.entity.StaticPage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StaticPageRepository extends MongoRepository<StaticPage, String> {
    Optional<StaticPage> findBySlugAndActiveTrueAndDeletedFalse(String slug);
}
