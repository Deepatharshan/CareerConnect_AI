package com.careerconnect.notification.event;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.careerconnect.notification.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

@Service
public class NotificationEventListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    public NotificationEventListener(EmailService emailService, ObjectMapper objectMapper) {
        this.emailService = emailService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "job-created-topic", groupId = "notification_group")
    public void handleJobCreatedEvent(String message) {
        System.out.println("Received JobCreated Event. Sending notifications to matched candidates...");
        System.out.println("Event Payload: " + message);
    }

    @KafkaListener(topics = "application-selected-topic", groupId = "notification_group")
    public void handleApplicationSelectedEvent(String message) {
        try {
            Map<String, String> payload = objectMapper.readValue(message, Map.class);
            String email = payload.get("applicantEmail");
            String name = payload.get("applicantName");
            String instructions = payload.get("employerInstructions");
            String employerEmail = payload.get("employerEmail");
            
            if (email != null) {
                String subject = "Congratulations! You have been selected";
                String text = "Dear " + name + ",\n\n" +
                              "Congratulations! Your application has been selected.\n\n" +
                              "Message from the Employer:\n" + instructions + "\n\n" +
                              "Best Regards,\nCareerConnect Team";
                emailService.sendSimpleMessage(email, subject, text, employerEmail);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
