package com.careerconnect.recommendation.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class RecommendationEventListener {
    private static final Logger log = LoggerFactory.getLogger(RecommendationEventListener.class);

    @KafkaListener(topics = "job-created-topic", groupId = "recommendation-service")
    public void onJobCreated(String payload) {
        log.info("Refreshing recommendation index after JobCreated event: {}", payload);
    }
}
