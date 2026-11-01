package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "refresh_tokens")
public class RefreshToken extends BaseEntity {

    @Indexed(unique = true)
    private String token;

    private String userType;   // ADMIN | CUSTOMER

    @Indexed
    private String userId;

    private LocalDateTime expiryDate;

    private boolean revoked = false;
}
