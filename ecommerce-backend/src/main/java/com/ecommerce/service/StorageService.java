package com.ecommerce.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Storage abstraction so the concrete backend (local disk, S3, Cloudinary, etc.)
 * can be swapped via `app.storage.type` without touching calling code.
 */
public interface StorageService {
    String upload(MultipartFile file, String folder);
    void delete(String fileUrl);
}
