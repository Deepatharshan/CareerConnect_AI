package com.careerconnect.auth.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private String role;
    private String message;

    public AuthResponse(String token, String userId, String role, String message) {
        this.token = token;
        this.userId = userId;
        this.role = role;
        this.message = message;
    }

    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
}
