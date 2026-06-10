package com.careerconnect.chat.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {
    private final Map<String, List<Map<String, String>>> rooms = new ConcurrentHashMap<>();

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<Map<String, String>>> messages(@PathVariable String roomId) {
        List<Map<String, String>> messages = new ArrayList<>(rooms.getOrDefault(roomId, List.of()));
        messages.sort(Comparator.comparing(message -> message.get("createdAt")));
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Map<String, String>> send(@PathVariable String roomId, @RequestBody Map<String, String> payload) {
        Map<String, String> message = Map.of(
                "id", UUID.randomUUID().toString(),
                "roomId", roomId,
                "senderId", payload.getOrDefault("senderId", "anonymous"),
                "body", payload.getOrDefault("body", ""),
                "createdAt", Instant.now().toString()
        );
        rooms.computeIfAbsent(roomId, ignored -> new ArrayList<>()).add(message);
        return ResponseEntity.ok(message);
    }
}
