package com.careerconnect.video;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class VideoInterviewServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VideoInterviewServiceApplication.class, args);
    }
}
