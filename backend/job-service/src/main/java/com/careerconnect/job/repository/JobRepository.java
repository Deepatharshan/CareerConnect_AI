package com.careerconnect.job.repository;

import com.careerconnect.job.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, String> {
    List<Job> findByStatus(Job.JobStatus status);
    List<Job> findByCompanyId(String companyId);

    @Query("select j from Job j " +
            "where j.status = :status " +
            "and (:q is null or lower(j.title) like lower(concat('%', :q, '%')) " +
            "or lower(j.description) like lower(concat('%', :q, '%')) " +
            "or lower(j.skills) like lower(concat('%', :q, '%'))) " +
            "and (:location is null or lower(j.location) like lower(concat('%', :location, '%'))) " +
            "and (:jobType is null or j.jobType = :jobType) " +
            "and (:salaryMin is null or j.salaryMax >= :salaryMin) " +
            "and (:experienceMax is null or j.experienceMin <= :experienceMax)")
    List<Job> search(@Param("status") Job.JobStatus status,
                     @Param("q") String q,
                     @Param("location") String location,
                     @Param("jobType") Job.JobType jobType,
                     @Param("salaryMin") BigDecimal salaryMin,
                     @Param("experienceMax") Integer experienceMax);
}
