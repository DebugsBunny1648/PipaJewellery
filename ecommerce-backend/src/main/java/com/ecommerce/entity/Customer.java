package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "customers")
public class Customer extends BaseEntity {

    @Indexed(unique = true)
    private String email;

    private String password; // nullable to support future social login

    private String firstName;
    private String lastName;

    @Indexed(unique = true, sparse = true)
    private String phone;

    private String avatarUrl;
    private LocalDate dateOfBirth;
    private String gender;

    private boolean emailVerified = false;
    private boolean phoneVerified = false;

    private LocalDateTime lastLoginAt;
}
