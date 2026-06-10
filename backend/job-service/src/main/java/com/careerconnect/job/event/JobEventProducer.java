package com.careerconnect.job.event;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class JobEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public JobEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendJobCreatedEvent(String jobId, String companyId, String jobTitle) {
        try {
            String message = String.format("{\"jobId\":\"%s\", \"companyId\":\"%s\", \"title\":\"%s\"}", jobId, companyId, jobTitle);
            kafkaTemplate.send("job-created-topic", jobId, message);
            System.out.println("Published JobCreated Event for Job: " + jobId);
        } catch (Exception e) {
            System.err.println("Failed to publish JobCreated Event for Job: " + jobId + " - " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception - job should be created even if Kafka is unavailable
        }
    }
}
