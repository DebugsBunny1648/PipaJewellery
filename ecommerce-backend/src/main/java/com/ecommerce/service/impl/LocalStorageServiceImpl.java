package com.ecommerce.service.impl;

import com.ecommerce.exception.BadRequestException;
import com.ecommerce.service.StorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

/**
 * Default local-disk implementation, active when app.storage.type=local (the default).
 * Swap in an S3/Cloudinary StorageService bean (same interface) for cloud deployments —
 * no controller/service code elsewhere needs to change.
 */
@Slf4j
@Service
public class LocalStorageServiceImpl implements StorageService {

    @Value("${app.storage.local.base-path}")
    private String basePath;

    @Value("${app.storage.local.base-url}")
    private String baseUrl;

    @Override
    public String upload(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }
        try {
            Path folderPath = Path.of(basePath, folder);
            Files.createDirectories(folderPath);

            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null
                    ? "file" : file.getOriginalFilename());
            String extension = originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.')) : "";
            String storedName = UUID.randomUUID() + extension;

            Path target = folderPath.resolve(storedName);
            Files.copy(file.getInputStream(), target);

            return baseUrl + "/" + folder + "/" + storedName;
        } catch (IOException ex) {
            log.error("File upload failed", ex);
            throw new BadRequestException("Failed to store uploaded file: " + ex.getMessage());
        }
    }

    @Override
    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;
        try {
            String relative = fileUrl.replaceFirst("^" + baseUrl + "/", "");
            Path target = Path.of(basePath, relative);
            Files.deleteIfExists(target);
        } catch (IOException ex) {
            log.warn("Failed to delete file {}: {}", fileUrl, ex.getMessage());
        }
    }
}
