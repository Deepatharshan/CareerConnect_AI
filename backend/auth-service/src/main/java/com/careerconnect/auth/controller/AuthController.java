package com.careerconnect.auth.controller;

import com.careerconnect.auth.dto.AuthRequest;
import com.careerconnect.auth.dto.AuthResponse;
import com.careerconnect.auth.model.User;
import com.careerconnect.auth.repository.UserRepository;
import com.careerconnect.auth.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, 
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(null, null, null, "Email is already registered."));
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        try {
            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException | NullPointerException e) {
            user.setRole(User.Role.JOB_SEEKER); // Default
        }

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());
        return ResponseEntity.ok(new AuthResponse(token, savedUser.getId(), savedUser.getRole().name(), "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            if (authentication.isAuthenticated()) {
                Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
                    return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getRole().name(), "Login successful"));
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null, "Invalid credentials"));
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null, "Authentication failed"));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestParam String token) {
        if (jwtUtil.validateToken(token)) {
            return ResponseEntity.ok("Token is valid.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is invalid or expired.");
    }
}
