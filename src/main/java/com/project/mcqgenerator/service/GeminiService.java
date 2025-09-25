package com.project.mcqgenerator.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model.name:gemini-2.5-flash}")
    private String geminiModelName; // default if not set

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .build();
    }

    public Mono<String> generateMcqs(String text) {
        // Build API URL
        String apiUrl = String.format("/%s:generateContent?key=%s", geminiModelName, apiKey);

        // Dynamic question count
        int wordCount = text.trim().split("\\s+").length;
        int numQuestions = Math.max(3, Math.min(20, wordCount / 30));

        String prompt = String.format(
                "Create exactly %d multiple-choice questions from the following text. " +
                        "The questions must be in a valid JSON array format. " +
                        "Each object in the array should have exactly three keys: 'question' (a string), 'options' (an array of 4 strings), " +
                        "and 'answer' (a string that is one of the provided options). Do not include any text or formatting outside of the JSON array. " +
                        "Here is the text: \n\n%s",
                numQuestions, text
        );

        // Build request body
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("role", "user"); // Important!
        content.put("parts", Collections.singletonList(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));

        return this.webClient.post()
                .uri(apiUrl)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }
}
