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

    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    @Column(length = 1000)
    private String applicantAddress;
    private String applicantCurrentStatus;
    private Integer expectedSalaryMin;
    private Integer expectedSalaryMax;

    @Column(length = 1500)
    private String applicantDescription;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private Integer aiMatchScore;

    @Column(length = 1000)
    private String resumeUrlUsed;

    @Column(length = 2000)
    private String employerInstructions;

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

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getApplicantPhone() { return applicantPhone; }
    public void setApplicantPhone(String applicantPhone) { this.applicantPhone = applicantPhone; }

    public String getApplicantAddress() { return applicantAddress; }
    public void setApplicantAddress(String applicantAddress) { this.applicantAddress = applicantAddress; }

    public String getApplicantCurrentStatus() { return applicantCurrentStatus; }
    public void setApplicantCurrentStatus(String applicantCurrentStatus) { this.applicantCurrentStatus = applicantCurrentStatus; }

    public Integer getExpectedSalaryMin() { return expectedSalaryMin; }
    public void setExpectedSalaryMin(Integer expectedSalaryMin) { this.expectedSalaryMin = expectedSalaryMin; }

    public Integer getExpectedSalaryMax() { return expectedSalaryMax; }
    public void setExpectedSalaryMax(Integer expectedSalaryMax) { this.expectedSalaryMax = expectedSalaryMax; }

    public String getApplicantDescription() { return applicantDescription; }
    public void setApplicantDescription(String applicantDescription) { this.applicantDescription = applicantDescription; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getResumeUrlUsed() { return resumeUrlUsed; }
    public void setResumeUrlUsed(String resumeUrlUsed) { this.resumeUrlUsed = resumeUrlUsed; }

    public boolean isSavedJob() { return savedJob; }
    public void setSavedJob(boolean savedJob) { this.savedJob = savedJob; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public Integer getAiMatchScore() { return aiMatchScore; }
    public void setAiMatchScore(Integer aiMatchScore) { this.aiMatchScore = aiMatchScore; }

    public String getEmployerInstructions() { return employerInstructions; }
    public void setEmployerInstructions(String employerInstructions) { this.employerInstructions = employerInstructions; }
}
