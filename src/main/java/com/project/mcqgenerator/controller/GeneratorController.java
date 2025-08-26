package com.project.mcqgenerator.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mcqgenerator.model.McqHistory;
import com.project.mcqgenerator.model.User;
import com.project.mcqgenerator.repository.McqHistoryRepository;
import com.project.mcqgenerator.repository.UserRepository;
import com.project.mcqgenerator.security.JwtUtil;
import com.project.mcqgenerator.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/generate")
public class GeneratorController {

    @Autowired
    private GeminiService geminiService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private McqHistoryRepository mcqHistoryRepository;
    // Helper to parse JSON
    private final ObjectMapper objectMapper = new ObjectMapper();

    public static class McqRequest {
        private String text;
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    @PostMapping("/mcq")
    public Mono<ResponseEntity<String>> generateMcqs(
            @RequestBody McqRequest mcqRequest,
            @RequestHeader(value = "Authorization", required = false) String token) {

        return geminiService.generateMcqs(mcqRequest.getText())
                .flatMap(responseBody -> {
                    if (token != null && token.startsWith("Bearer ")) {
                        String jwt = token.substring(7);
                        String email = jwtUtil.extractUsername(jwt);
                        Optional<User> userOpt = userRepository.findByEmail(email);

                        if (userOpt.isPresent()) {
                            User user = userOpt.get();
                            McqHistory historyEntry = new McqHistory();
                            historyEntry.setUserId(user.getId());
                            historyEntry.setOriginalText(mcqRequest.getText());

                            // --- THIS IS THE FIX ---
                            // We now parse the raw response and save ONLY the clean MCQ text
                            try {
                                JsonNode root = objectMapper.readTree(responseBody);
                                String cleanMcqJson = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                                historyEntry.setGeneratedMcqs(cleanMcqJson);
                            } catch (Exception e) {
                                // Fallback in case of parsing error
                                historyEntry.setGeneratedMcqs(responseBody);
                            }
                            // --- END OF FIX ---

                            historyEntry.setCreatedAt(LocalDateTime.now());
                            mcqHistoryRepository.save(historyEntry);
                        }
                    }
                    return Mono.just(ResponseEntity.ok(responseBody));
                }).onErrorResume(e -> {
                    System.err.println("Error in generation or saving process: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body("Error processing your request."));
                });
    }
}