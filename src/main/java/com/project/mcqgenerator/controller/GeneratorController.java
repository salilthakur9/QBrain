package com.project.mcqgenerator.controller;

import com.project.mcqgenerator.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/generate")
public class GeneratorController {

    // UNCOMMENT and Autowire the service
    @Autowired
    private GeminiService geminiService;

    // This is a small class to define the shape of our incoming JSON
    public static class McqRequest {
        private String text;
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    @PostMapping("/mcq")
    public Mono<ResponseEntity<String>> generateMcqs(@RequestBody McqRequest mcqRequest) {
        // Now we call the real service and return its response
        return geminiService.generateMcqs(mcqRequest.getText())
                .map(responseBody -> ResponseEntity.ok(responseBody))
                .onErrorResume(e -> {
                    // Basic error handling
                    System.err.println("Error calling Gemini API: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body("Error generating MCQs."));
                });
    }
}