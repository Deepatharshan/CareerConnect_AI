package com.careerconnect.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> analytics() {
        return ResponseEntity.ok(Map.of(
                "activeUsers", 1284,
                "openJobs", 342,
                "applicationsToday", 91,
                "interviewsScheduled", 18,
                "timestamp", Instant.now().toString()
        ));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Map<String, Object>>> reports() {
        return ResponseEntity.ok(List.of(
                Map.of("name", "Hiring funnel", "status", "READY"),
                Map.of("name", "Job seeker growth", "status", "READY"),
                Map.of("name", "AI CV scoring distribution", "status", "READY")
        ));
    }
}
