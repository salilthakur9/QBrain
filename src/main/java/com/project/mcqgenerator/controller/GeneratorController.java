package com.project.mcqgenerator.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mcqgenerator.model.McqHistory;
import com.project.mcqgenerator.model.User;
import com.project.mcqgenerator.repository.McqHistoryRepository;
import com.project.mcqgenerator.repository.UserRepository;
import com.project.mcqgenerator.security.JwtUtil;
import com.project.mcqgenerator.service.GeminiService;
import com.project.mcqgenerator.service.PdfService; // Import the new service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import for file handling
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/generate")
public class GeneratorController {

    @Autowired
    private GeminiService geminiService;
    @Autowired
    private PdfService pdfService; // Autowire the new service
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private McqHistoryRepository mcqHistoryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public static class McqRequest {
        private String text;
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    // This is our existing endpoint for text
    @PostMapping("/mcq")
    public Mono<ResponseEntity<String>> generateMcqsFromText(
            @RequestBody McqRequest mcqRequest,
            @RequestHeader(value = "Authorization", required = false) String token) {

        return processGeneration(mcqRequest.getText(), token);
    }

    // --- NEW ENDPOINT FOR PDF UPLOADS ---
    @PostMapping("/mcq-pdf")
    public Mono<ResponseEntity<String>> generateMcqsFromPdf(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String extractedText = pdfService.extractText(file);
            if (extractedText.isBlank()) {
                return Mono.just(ResponseEntity.badRequest().body("Could not extract text from PDF."));
            }
            return processGeneration(extractedText, token);
        } catch (IOException e) {
            System.err.println("Error processing PDF file: " + e.getMessage());
            return Mono.just(ResponseEntity.status(500).body("Error reading PDF file."));
        }
    }

    // --- NEW HELPER METHOD ---
    // We've moved the common logic into this reusable method
    private Mono<ResponseEntity<String>> processGeneration(String text, String token) {
        return geminiService.generateMcqs(text)
                .flatMap(responseBody -> {
                    if (token != null && token.startsWith("Bearer ")) {
                        String jwt = token.substring(7);
                        String email = jwtUtil.extractUsername(jwt);
                        userRepository.findByEmail(email).ifPresent(user -> {
                            McqHistory historyEntry = new McqHistory();
                            historyEntry.setUserId(user.getId());
                            historyEntry.setOriginalText(text); // Use the provided text
                            try {
                                JsonNode root = objectMapper.readTree(responseBody);
                                String cleanMcqJson = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                                historyEntry.setGeneratedMcqs(cleanMcqJson);
                            } catch (Exception e) {
                                historyEntry.setGeneratedMcqs(responseBody);
                            }
                            historyEntry.setCreatedAt(LocalDateTime.now());
                            mcqHistoryRepository.save(historyEntry);
                        });
                    }
                    return Mono.just(ResponseEntity.ok(responseBody));
                }).onErrorResume(e -> {
                    System.err.println("Error in generation or saving process: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body("Error processing your request."));
                });
    }
}