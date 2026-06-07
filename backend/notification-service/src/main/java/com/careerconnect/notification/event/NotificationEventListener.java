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
            String jobTitle = payload.get("jobTitle") != null ? payload.get("jobTitle") : "the position";
            String companyName = payload.get("companyName") != null ? payload.get("companyName") : "our company";
            
            if (email != null) {
                String subject = "Congratulations! You have been selected for " + jobTitle;
                
                String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;\">" +
                    "<h2 style=\"color: #4F46E5;\">Congratulations, " + name + "!</h2>" +
                    "<p style=\"font-size: 16px; line-height: 1.5;\">We are thrilled to inform you that your application for the <strong>" + jobTitle + "</strong> position at <strong>" + companyName + "</strong> has been successful, and you have been selected to move forward!</p>" +
                    "<div style=\"background-color: #F3F4F6; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0; border-radius: 4px;\">" +
                    "<h3 style=\"margin-top: 0; color: #111827; font-size: 16px;\">Message from the Employer:</h3>" +
                    "<p style=\"font-style: italic; margin-bottom: 0;\">\"" + instructions + "\"</p>" +
                    "</div>" +
                    "<p style=\"font-size: 14px; color: #6B7280;\">If you have any questions, you can reply directly to this email to contact the recruiter.</p>" +
                    "<hr style=\"border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;\" />" +
                    "<p style=\"font-size: 12px; color: #9CA3AF;\">Best Regards,<br><strong>CareerConnect Team</strong></p>" +
                    "</div>";
                
                emailService.sendHtmlMessage(email, subject, htmlContent, employerEmail);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
