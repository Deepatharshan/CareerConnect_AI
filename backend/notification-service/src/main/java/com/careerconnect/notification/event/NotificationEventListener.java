package com.careerconnect.notification.event;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationEventListener {

    @KafkaListener(topics = "job-created-topic", groupId = "notification_group")
    public void handleJobCreatedEvent(String message) {
        // Logic to send email/push notification
        System.out.println("Received JobCreated Event. Sending notifications to matched candidates...");
        System.out.println("Event Payload: " + message);
    }
}
