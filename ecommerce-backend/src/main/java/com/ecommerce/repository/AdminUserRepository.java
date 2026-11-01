package com.ecommerce.repository;

import com.ecommerce.entity.AdminUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminUserRepository extends MongoRepository<AdminUser, String> {

    Optional<AdminUser> findByUsernameAndDeletedFalse(String username);

    Optional<AdminUser> findByEmailAndDeletedFalse(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
