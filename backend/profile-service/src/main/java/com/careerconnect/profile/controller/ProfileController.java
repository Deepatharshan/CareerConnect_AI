package com.careerconnect.profile.controller;

import com.careerconnect.profile.model.UserProfile;
import com.careerconnect.profile.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

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
}
