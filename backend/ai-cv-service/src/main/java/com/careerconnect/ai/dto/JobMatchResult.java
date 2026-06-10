package com.careerconnect.ai.dto;

public class JobMatchResult {
    private String jobId;
    private int score;
    private String reasoning;

    public JobMatchResult() {}

    public JobMatchResult(String jobId, int score, String reasoning) {
        this.jobId = jobId;
        this.score = score;
        this.reasoning = reasoning;
    }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }
}
