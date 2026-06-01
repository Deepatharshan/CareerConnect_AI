package com.careerconnect.recommendation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    @GetMapping("/jobs/{userId}")
    public ResponseEntity<List<Map<String, Object>>> recommendJobs(@PathVariable String userId,
                                                                   @RequestParam(required = false) String skills,
                                                                   @RequestParam(required = false) String experience) {
        List<Map<String, Object>> recommendations = List.of(
                Map.of("jobTitle", "Cloud-Native Java Engineer", "matchScore", 92, "reason", "Strong Java and Spring Boot fit; add Kafka project examples."),
                Map.of("jobTitle", "Platform Backend Developer", "matchScore", 86, "reason", "Microservices experience aligns with Docker and Kubernetes roles."),
                Map.of("jobTitle", "AI Product Engineer", "matchScore", 78, "reason", "Profile shows full-stack capability plus AI feature interest.")
        );
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/behavior")
    public ResponseEntity<Map<String, String>> recordBehavior(@RequestBody Map<String, String> event) {
        return ResponseEntity.ok(Map.of("status", "recorded", "eventType", event.getOrDefault("eventType", "UNKNOWN")));
    }
}
