package com.careerconnect.ai.service;

import com.careerconnect.ai.dto.CvAnalysisResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;

@Service
public class LlmAnalysisService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.gemini.api-url}")
    private String geminiApiUrl;

    @Value("${ai.gemini.api-key}")
    private String geminiApiKey;

    public LlmAnalysisService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public CvAnalysisResult analyzeCvAgainstJob(String cvContent, String jobId) {
        try {
            String prompt = "You are an expert ATS evaluator. Analyze the following CV against standard tech roles. " +
                    "Return ONLY a raw JSON object with the following schema: " +
                    "{ \"atsScore\": <integer 0-100>, \"extractedSkills\": [\"skill1\", \"skill2\"], " +
                    "\"missingSkills\": [\"skill3\"], \"feedback\": \"<brief feedback>\" }. " +
                    "Do NOT wrap it in markdown block like ```json ... ```. " +
                    "Here is the CV text: " + cvContent;

            String requestBody = "{" +
                    "  \"contents\": [" +
                    "    {" +
                    "      \"parts\": [" +
                    "        {\"text\": " + objectMapper.writeValueAsString(prompt) + "}" +
                    "      ]" +
                    "    }" +
                    "  ]," +
                    "  \"generationConfig\": {" +
                    "    \"responseMimeType\": \"application/json\"" +
                    "  }" +
                    "}";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-goog-api-key", geminiApiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(geminiApiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    String jsonContent = textNode.asText();
                    
                    // Parse the generated JSON response
                    JsonNode resultNode = objectMapper.readTree(jsonContent);
                    int atsScore = resultNode.path("atsScore").asInt(50);
                    
                    List<String> extractedSkills = new ArrayList<>();
                    resultNode.path("extractedSkills").forEach(node -> extractedSkills.add(node.asText()));
                    
                    List<String> missingSkills = new ArrayList<>();
                    resultNode.path("missingSkills").forEach(node -> missingSkills.add(node.asText()));
                    
                    String feedback = resultNode.path("feedback").asText("No feedback provided.");
                    
                    return new CvAnalysisResult(atsScore, extractedSkills, missingSkills, feedback);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Fallback in case of error
        return new CvAnalysisResult(0, new ArrayList<>(), new ArrayList<>(), "Failed to analyze CV with AI.");
    }
}
