package com.careerconnect.ai.controller;

import com.careerconnect.ai.dto.CvAnalysisResult;
import com.careerconnect.ai.dto.JobMatchResult;
import com.careerconnect.ai.service.LlmAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
public class AiAnalysisController {

    private final LlmAnalysisService llmAnalysisService;

    public AiAnalysisController(LlmAnalysisService llmAnalysisService) {
        this.llmAnalysisService = llmAnalysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<CvAnalysisResult> analyzeCv(@RequestBody Map<String, String> payload) {
        String cvUrl = payload.getOrDefault("cvUrl", payload.get("cvText"));
        String targetJobId = payload.get("targetJobId");

        CvAnalysisResult result = llmAnalysisService.analyzeCvAgainstJob(cvUrl, targetJobId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/cv/upload")
    public ResponseEntity<CvAnalysisResult> uploadAndAnalyze(@RequestParam("file") MultipartFile file,
                                                             @RequestParam(required = false) String targetJobId) {
        try {
            String extractedText = extractTextFromPdf(file);
            CvAnalysisResult result = llmAnalysisService.analyzeCvAgainstJob(extractedText, targetJobId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/cv/match-jobs")
    public ResponseEntity<List<JobMatchResult>> matchCvAgainstJobs(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("jobsJson") String jobsJson) {
        try {
            StringBuilder combinedText = new StringBuilder();
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    combinedText.append(extractTextFromPdf(file)).append("\n\n");
                }
            }
            List<JobMatchResult> results = llmAnalysisService.matchCvAgainstJobs(combinedText.toString(), jobsJson);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    private String extractTextFromPdf(MultipartFile file) throws Exception {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
    
    @GetMapping("/recommend/{userId}")
    public ResponseEntity<String> getRecommendations(@PathVariable String userId) {
        return ResponseEntity.ok("LLM-Generated recommendation: You should pivot to Backend Engineering based on your historical behavior.");
    }
}
