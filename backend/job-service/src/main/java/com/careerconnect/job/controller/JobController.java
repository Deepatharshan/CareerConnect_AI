package com.careerconnect.job.controller;

import com.careerconnect.job.event.JobEventProducer;
import com.careerconnect.job.model.Job;
import com.careerconnect.job.repository.JobRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final JobEventProducer eventProducer;

    public JobController(JobRepository jobRepository, JobEventProducer eventProducer) {
        this.jobRepository = jobRepository;
        this.eventProducer = eventProducer;
    }

    @GetMapping
    public List<Job> getAllOpenJobs(@RequestParam(required = false) String q,
                                    @RequestParam(required = false) String location,
                                    @RequestParam(required = false) String jobType,
                                    @RequestParam(required = false) BigDecimal salaryMin,
                                    @RequestParam(required = false) Integer experienceMax) {
        if (q != null || location != null || jobType != null || salaryMin != null || experienceMax != null) {
            Job.JobType type = jobType == null || jobType.isBlank() ? null : Job.JobType.valueOf(jobType.toUpperCase());
            return jobRepository.search(Job.JobStatus.OPEN, blankToNull(q), blankToNull(location), type, salaryMin, experienceMax);
        }
        return jobRepository.findByStatus(Job.JobStatus.OPEN);
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        job.setStatus(Job.JobStatus.OPEN);
        Job savedJob = jobRepository.save(job);
        eventProducer.sendJobCreatedEvent(savedJob.getId(), savedJob.getCompanyId(), savedJob.getTitle());
        return ResponseEntity.ok(savedJob);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobDetails(@PathVariable("id") String id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/company/{companyId}")
    public List<Job> getCompanyJobs(@PathVariable("companyId") String companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable String id, @RequestBody Job update) {
        return jobRepository.findById(id).map(existing -> {
            update.setId(existing.getId());
            update.setCreatedAt(existing.getCreatedAt());
            return ResponseEntity.ok(jobRepository.save(update));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable String id) {
        return jobRepository.findById(id).map(job -> {
            job.setStatus(Job.JobStatus.CLOSED);
            jobRepository.save(job);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
