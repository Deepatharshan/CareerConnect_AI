package com.careerconnect.ai.dto;

import java.util.List;

public class CvAnalysisResult {
    private int atsScore;
    private List<String> extractedSkills;
    private List<String> missingSkillsForTargetRole;
    private String feedback;
    private List<String> recommendedRoles;
    private List<String> improvements;

    public CvAnalysisResult(int atsScore, List<String> extractedSkills, List<String> missingSkillsForTargetRole, String feedback) {
        this.atsScore = atsScore;
        this.extractedSkills = extractedSkills;
        this.missingSkillsForTargetRole = missingSkillsForTargetRole;
        this.feedback = feedback;
        this.recommendedRoles = List.of("Backend Engineer", "Cloud-Native Java Developer");
        this.improvements = List.of("Add measurable impact to recent projects.", "Include Docker, Kubernetes, and Kafka project evidence.", "Move technical skills above education for ATS scanning.");
    }

    public int getAtsScore() { return atsScore; }
    public List<String> getExtractedSkills() { return extractedSkills; }
    public List<String> getMissingSkillsForTargetRole() { return missingSkillsForTargetRole; }
    public String getFeedback() { return feedback; }
    public List<String> getRecommendedRoles() { return recommendedRoles; }
    public List<String> getImprovements() { return improvements; }
}
