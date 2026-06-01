package com.careerconnect.application.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    private String id;

    @Column(nullable = false)
    private String jobId;

    @Column(nullable = false)
    private String candidateId;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private String resumeUrlUsed;

    private boolean savedJob;

    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.appliedAt == null) {
            this.appliedAt = LocalDateTime.now();
        }
    }

    public enum ApplicationStatus {
        SAVED, APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW_SCHEDULED, WITHDRAWN, REJECTED, SELECTED
    }

    // --- Getters and Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getResumeUrlUsed() { return resumeUrlUsed; }
    public void setResumeUrlUsed(String resumeUrlUsed) { this.resumeUrlUsed = resumeUrlUsed; }

    public boolean isSavedJob() { return savedJob; }
    public void setSavedJob(boolean savedJob) { this.savedJob = savedJob; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
