package com.ecommerce.repository;

import com.ecommerce.constant.RoleName;
import com.ecommerce.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(RoleName name);
}
