package com.careerconnect.video.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewController {

    @PostMapping("/schedule")
    public ResponseEntity<Map<String, String>> schedule(@RequestBody Map<String, String> payload) {
        String interviewId = UUID.randomUUID().toString();
        String meetingLink = "https://meet.careerconnect.local/webrtc/" + interviewId;
        return ResponseEntity.ok(Map.of(
                "interviewId", interviewId,
                "applicationId", payload.getOrDefault("applicationId", ""),
                "candidateId", payload.getOrDefault("candidateId", ""),
                "employerId", payload.getOrDefault("employerId", ""),
                "scheduledAt", payload.getOrDefault("scheduledAt", Instant.now().plusSeconds(86400).toString()),
                "meetingLink", meetingLink,
                "status", "INTERVIEW_SCHEDULED"
        ));
    }

    @PostMapping("/links")
    public ResponseEntity<Map<String, String>> generateLink() {
        String interviewId = UUID.randomUUID().toString();
        return ResponseEntity.ok(Map.of(
                "interviewId", interviewId,
                "meetingLink", "https://meet.careerconnect.local/webrtc/" + interviewId,
                "provider", "WEBRTC"
        ));
    }
}
