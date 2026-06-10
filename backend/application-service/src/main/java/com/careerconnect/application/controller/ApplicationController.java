package com.careerconnect.application.controller;

import com.careerconnect.application.model.Application;
import com.careerconnect.application.repository.ApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.springframework.kafka.core.KafkaTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationRepository repository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public ApplicationController(ApplicationRepository repository, KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
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
            Application.ApplicationStatus newStatus = Application.ApplicationStatus.valueOf(payload.get("status").toUpperCase());
            app.setStatus(newStatus);
            if (payload.containsKey("employerInstructions")) {
                app.setEmployerInstructions(payload.get("employerInstructions"));
            }
            Application saved = repository.save(app);
            
            if (newStatus == Application.ApplicationStatus.SELECTED && app.getApplicantEmail() != null) {
                try {
                    Map<String, String> eventPayload = new HashMap<>();
                    eventPayload.put("applicantEmail", app.getApplicantEmail());
                    eventPayload.put("applicantName", app.getApplicantName() != null ? app.getApplicantName() : "Candidate");
                    
                    if (payload.containsKey("jobTitle")) {
                        eventPayload.put("jobTitle", payload.get("jobTitle"));
                    } else {
                        eventPayload.put("jobTitle", app.getJobId());
                    }

                    if (payload.containsKey("companyName")) {
                        eventPayload.put("companyName", payload.get("companyName"));
                    } else {
                        eventPayload.put("companyName", "The Employer");
                    }

                    eventPayload.put("employerInstructions", app.getEmployerInstructions() != null ? app.getEmployerInstructions() : "");
                    if (payload.containsKey("employerEmail")) {
                        eventPayload.put("employerEmail", payload.get("employerEmail"));
                    }
                    
                    kafkaTemplate.send("application-selected-topic", objectMapper.writeValueAsString(eventPayload));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return ResponseEntity.ok(saved);
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

    @DeleteMapping("/{appId}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String appId) {
        if (repository.existsById(appId)) {
            repository.deleteById(appId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
