package com.careerconnect.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow requests from frontend
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",      // Dev Frontend
            "http://localhost:3000",      // Alternative dev port
            "http://127.0.0.1:5173",      // localhost alternative
            "https://localhost:5173"      // HTTPS variant
        ));
        
        // Allow all HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Allow necessary headers
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));
        
        // Allow credentials (JWT tokens, cookies)
        corsConfig.setAllowCredentials(true);
        
        // Expose headers that client might need
        corsConfig.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Total-Count",
            "X-Page-Number"
        ));
        
        // Cache preflight response for 1 hour
        corsConfig.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
