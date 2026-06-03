package com.careerconnect.job.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/v1/jobs/uploads")
public class JobUploadController {

    @PostMapping("/poster")
    public ResponseEntity<String> uploadPoster(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        try {
            String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("poster");
            String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String storedName = UUID.randomUUID() + "-" + safeName;
            
            Path uploadDir = Paths.get("uploads", "posters").toAbsolutePath();
            Files.createDirectories(uploadDir);
            
            Path filePath = uploadDir.resolve(storedName);
            Files.copy(file.getInputStream(), filePath);
            
            return ResponseEntity.ok("/api/v1/jobs/uploads/posters/" + storedName);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/posters/{fileName:.+}")
    public ResponseEntity<?> downloadPoster(@PathVariable String fileName) {
        try {
            Path uploadDir = Paths.get("uploads", "posters").toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(fileName).normalize();
            if (!filePath.startsWith(uploadDir) || !Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";
            byte[] fileContent = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
