package com.project.mcqgenerator.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public Mono<String> generateMcqs(String text) {
        String apiUrl = "/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey;

        // --- NEW: DYNAMIC QUESTION COUNT LOGIC ---
        int wordCount = text.trim().split("\\s+").length;
        // Logic: 1 question per 50 words, with a minimum of 3 and a maximum of 10.
        int numQuestions = Math.max(3, Math.min(20, wordCount / 30));

        String prompt = String.format(
                "Create exactly %d multiple-choice questions from the following text. " +
                        "The questions must be in a valid JSON array format. " +
                        "Each object in the array should have exactly three keys: 'question' (a string), 'options' (an array of 4 strings), " +
                        "and 'answer' (a string that is one of the provided options). Do not include any text or formatting outside of the JSON array. " +
                        "Here is the text: \n\n%s",
                numQuestions, text
        );
        // --- END OF NEW LOGIC ---

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
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