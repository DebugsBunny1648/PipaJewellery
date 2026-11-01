package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "admin_users")
public class AdminUser extends BaseEntity {

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String fullName;
    private String phone;
    private String avatarUrl;

    /** Reference into the `roles` collection. */
    private String roleId;

    private boolean emailVerified = false;

    private LocalDateTime lastLoginAt;
}
