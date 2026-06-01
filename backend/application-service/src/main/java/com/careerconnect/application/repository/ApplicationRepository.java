package com.careerconnect.application.repository;

import com.careerconnect.application.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, String> {
    List<Application> findByCandidateId(String candidateId);
    List<Application> findByJobId(String jobId);
}
