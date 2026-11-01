package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * Common audit + soft-delete + active-status fields shared by every document in the platform.
 * `id` is a String here (Mongo ObjectId, hex-encoded) rather than a Long — every DTO,
 * controller path variable, and foreign-key-style reference field in this codebase uses
 * String ids accordingly; nothing parses an id as a number.
 */
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class BaseEntity {

    @Id
    private String id;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;

    private boolean active = true;

    private boolean deleted = false;

    private LocalDateTime deletedAt;
}
