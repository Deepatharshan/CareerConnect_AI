package com.careerconnect.profile.controller;

import com.careerconnect.profile.model.UserProfile;
import com.careerconnect.profile.repository.UserProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    private static final Logger logger = Logger.getLogger(ProfileController.class.getName());
    private final UserProfileRepository repository;

    public ProfileController(UserProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable String userId) {
        return repository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserProfile> createOrUpdateProfile(@RequestBody UserProfile profile) {
        Optional<UserProfile> existing = repository.findByUserId(profile.getUserId());
        if (existing.isPresent()) {
            profile.setId(existing.get().getId()); 
        }
        UserProfile saved = repository.save(profile);
        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/{userId}/cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCv(@PathVariable String userId, @RequestParam("file") MultipartFile file, @RequestParam(value = "name", required = false) String name) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        try {
            UserProfile profile = repository.findByUserId(userId).orElseGet(() -> {
                UserProfile created = new UserProfile();
                created.setUserId(userId);
                return created;
            });

            if (profile.getCvs().size() >= 7) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Maximum 7 CVs allowed.");
            }

            String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("cv");
            String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String storedName = userId + "-" + UUID.randomUUID() + "-" + safeName;
            
            Path uploadDir = Paths.get("uploads", "cvs").toAbsolutePath();
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(storedName);
            Files.copy(file.getInputStream(), filePath);
            
            String cvName = (name != null && !name.trim().isEmpty()) ? name : originalName;
            String cvUrl = "/api/v1/profiles/cv-files/" + storedName;
            
            com.careerconnect.profile.model.CvDocument cvDoc = new com.careerconnect.profile.model.CvDocument(
                UUID.randomUUID().toString(), cvName, cvUrl, Instant.now().toString()
            );
            
            profile.getCvs().add(cvDoc);
            UserProfile saved = repository.save(profile);
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{userId}/cv/{cvId}")
    public ResponseEntity<?> deleteCv(@PathVariable String userId, @PathVariable String cvId) {
        Optional<UserProfile> existing = repository.findByUserId(userId);
        if (existing.isPresent()) {
            UserProfile profile = existing.get();
            boolean removed = profile.getCvs().removeIf(cv -> cv.getId().equals(cvId));
            if (removed) {
                UserProfile saved = repository.save(profile);
                return ResponseEntity.ok(saved);
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/{userId}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfilePicture(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        try {
            String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("profile_pic");
            String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String storedName = userId + "-" + UUID.randomUUID() + "-" + safeName;
            
            Path uploadDir = Paths.get("uploads", "pictures").toAbsolutePath();
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(storedName);
            Files.copy(file.getInputStream(), filePath);
            
            UserProfile profile = repository.findByUserId(userId).orElseGet(() -> {
                UserProfile created = new UserProfile();
                created.setUserId(userId);
                return created;
            });
            
            profile.setProfilePictureUrl("/api/v1/profiles/picture-files/" + storedName);
            UserProfile saved = repository.save(profile);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/picture-files/{fileName:.+}")
    public ResponseEntity<?> downloadProfilePicture(@PathVariable String fileName) {
        try {
            Path uploadDir = Paths.get("uploads", "pictures").toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(fileName).normalize();

            if (!filePath.startsWith(uploadDir) || !Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            byte[] fileContent = Files.readAllBytes(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "image/jpeg"))
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cv-files/{fileName:.+}")
    public ResponseEntity<?> downloadCv(@PathVariable String fileName, @RequestParam(required = false, defaultValue = "inline") String mode) {
        try {
            // Resolve paths carefully to prevent directory traversal
            Path uploadDir = Paths.get("uploads", "cvs").toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(fileName).normalize();

            logger.info("Attempting to download CV: " + filePath.toString());
            logger.info("Upload dir: " + uploadDir.toString());
            logger.info("File exists: " + Files.exists(filePath));

            // Security check - ensure file is within uploads/cvs directory
            if (!filePath.startsWith(uploadDir)) {
                logger.warning("Security violation - attempted path traversal: " + filePath.toString());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            if (!Files.exists(filePath)) {
                logger.warning("File not found: " + filePath.toString());
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Support both inline viewing and attachment download
            String disposition = "attachment".equalsIgnoreCase(mode) ? "attachment" : "inline";
            String filename = filePath.getFileName().toString();

            byte[] fileContent = Files.readAllBytes(filePath);
            
            logger.info("Serving CV file: " + filename + " (" + fileContent.length + " bytes)");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + filename + "\"")
                    .header("Access-Control-Expose-Headers", "Content-Disposition")
                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
                    .body(fileContent);
        } catch (Exception e) {
            logger.severe("Error downloading CV: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving CV: " + e.getMessage());
        }
    }
}
