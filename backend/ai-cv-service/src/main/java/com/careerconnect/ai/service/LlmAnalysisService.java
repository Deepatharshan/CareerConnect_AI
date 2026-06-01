package com.careerconnect.ai.service;

import com.careerconnect.ai.dto.CvAnalysisResult;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class LlmAnalysisService {

    public CvAnalysisResult analyzeCvAgainstJob(String pdfContentOrUrl, String jobId) {
        // In a real system, you would:
        // 1. Download PDF from S3/GridFS.
        // 2. Extract Text (e.g. Apache PDFBox)
        // 3. Send text + Job Description to an LLM (OpenAI API / Local Llama).
        
        // Mocking the LLM outcome for the enterprise architecture POC
        
        List<String> mockExtracted = Arrays.asList("Java", "Spring Boot", "MySQL", "Git");
        List<String> mockMissing = Arrays.asList("Docker", "Kubernetes", "Kafka");
        String feedBack = "Your CV lacks Docker and Kubernetes skills for backend cloud-native roles. Add these to improve your ATS score.";
        
        return new CvAnalysisResult(65, mockExtracted, mockMissing, feedBack);
    }
}
