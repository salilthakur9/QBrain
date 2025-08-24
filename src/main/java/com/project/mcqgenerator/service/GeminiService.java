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

    // Injects the WebClient bean for making HTTP requests
    private final WebClient webClient;

    // Injects the API key from application.properties
    @Value("${gemini.api.key}")
    private String apiKey;

    // Constructor to initialize the WebClient
    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public Mono<String> generateMcqs(String text) {
        // The specific URL for the Gemini Pro model
        String apiUrl = "/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey;

        // A carefully crafted prompt asking for a specific JSON structure
        String prompt = "Create 5 multiple-choice questions from the following text. The questions must be in a valid JSON array format. " +
                "Each object in the array should have exactly three keys: 'question' (a string), 'options' (an array of 4 strings), " +
                "and 'answer' (a string that is one of the provided options). Do not include any text or formatting outside of the JSON array. " +
                "Here is the text: \n\n" + text;

        // Building the request body for the Gemini API
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));

        // Making the POST request and handling the response
        return this.webClient.post()
                .uri(apiUrl)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class); // We get the raw JSON response as a String
    }
}