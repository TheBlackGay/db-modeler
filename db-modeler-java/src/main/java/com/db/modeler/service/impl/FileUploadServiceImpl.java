package com.db.modeler.service.impl;

import com.db.modeler.service.FileUploadService;
import com.db.modeler.exception.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${app.upload.dir:${user.home}/db-modeler/uploads}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(filename);

            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return the file URL
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new FileUploadException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }
}
