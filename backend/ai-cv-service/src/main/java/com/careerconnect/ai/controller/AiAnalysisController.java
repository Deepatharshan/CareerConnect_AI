package com.careerconnect.ai.controller;

import com.careerconnect.ai.dto.CvAnalysisResult;
import com.careerconnect.ai.service.LlmAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

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
        CvAnalysisResult result = llmAnalysisService.analyzeCvAgainstJob(file.getOriginalFilename(), targetJobId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/recommend/{userId}")
    public ResponseEntity<String> getRecommendations(@PathVariable String userId) {
        return ResponseEntity.ok("LLM-Generated recommendation: You should pivot to Backend Engineering based on your historical behavior.");
    }
}
