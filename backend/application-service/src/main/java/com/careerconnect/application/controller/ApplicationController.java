package com.careerconnect.application.controller;

import com.careerconnect.application.model.Application;
import com.careerconnect.application.repository.ApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationRepository repository;

    public ApplicationController(ApplicationRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Application> applyForJob(
            @PathVariable("jobId") String jobId,
            @RequestBody Application application) {
        application.setJobId(jobId);
        application.setStatus(Application.ApplicationStatus.APPLIED);
        Application saved = repository.save(application);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public List<Application> getUserApplications(@PathVariable("userId") String userId) {
        return repository.findByCandidateId(userId);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return repository.findAll();
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(@PathVariable("jobId") String jobId) {
        return repository.findByJobId(jobId);
    }

    @PatchMapping("/{appId}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable("appId") String appId,
            @RequestBody Map<String, String> payload) {
        return repository.findById(appId).map(app -> {
            app.setStatus(Application.ApplicationStatus.valueOf(
                    payload.get("status").toUpperCase()));
            return ResponseEntity.ok(repository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save/{jobId}")
    public ResponseEntity<Application> saveJob(@PathVariable String jobId, @RequestBody Application application) {
        application.setJobId(jobId);
        application.setSavedJob(true);
        application.setStatus(Application.ApplicationStatus.SAVED);
        return ResponseEntity.ok(repository.save(application));
    }

    @PatchMapping("/{appId}/withdraw")
    public ResponseEntity<Application> withdraw(@PathVariable String appId) {
        return repository.findById(appId).map(app -> {
            app.setStatus(Application.ApplicationStatus.WITHDRAWN);
            return ResponseEntity.ok(repository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }
}
