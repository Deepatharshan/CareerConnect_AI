package com.careerconnect.notification.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendSimpleMessage(String to, String subject, String text, String replyTo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage(); 
            message.setFrom("panchdeepan147@gmail.com");
            if (replyTo != null && !replyTo.isEmpty()) {
                message.setReplyTo(replyTo);
            }
            message.setTo(to); 
            message.setSubject(subject); 
            message.setText(text);
            emailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    public void sendHtmlMessage(String to, String subject, String htmlContent, String replyTo) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("panchdeepan147@gmail.com", "CareerConnect Platform");
            if (replyTo != null && !replyTo.isEmpty()) {
                helper.setReplyTo(replyTo);
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML content
            
            emailSender.send(message);
            System.out.println("HTML Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Failed to send HTML email to " + to + ": " + e.getMessage());
        }
    }
}
