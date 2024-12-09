package com.db.modeler.controller;

import com.db.modeler.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileUploadService.uploadFile(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        return ResponseEntity.ok(response);
    }
}
