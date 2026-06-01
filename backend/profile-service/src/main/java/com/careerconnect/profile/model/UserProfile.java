package com.careerconnect.profile.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "user_profiles")
public class UserProfile {
    
    @Id
    private String id;
    private String userId; // UUID from Auth service
    
    private String firstName;
    private String lastName;
    private String headline;
    
    private List<Map<String, String>> education;
    private List<Map<String, String>> experience;
    private List<String> skills;
    
    private String cvUrl;
    private String profilePictureUrl;

    // Getters and Setters overrides omitted for brevity 
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
}
