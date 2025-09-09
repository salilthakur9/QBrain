package com.project.mcqgenerator.controller;

import com.project.mcqgenerator.model.McqHistory;
import com.project.mcqgenerator.model.User;
import com.project.mcqgenerator.repository.McqHistoryRepository;
import com.project.mcqgenerator.repository.UserRepository;
import com.project.mcqgenerator.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private McqHistoryRepository mcqHistoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getUserHistory(@RequestHeader("Authorization") String token) {
        System.out.println("\n--- HISTORY ENDPOINT TRIGGERED ---");
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            System.out.println("1. Fetching history for email: " + email);

            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                System.out.println("!!! ERROR: User not found in database for this email!");
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOpt.get();
            // --- THIS IS THE FIX ---
            // user.getId() now returns a Long, so we store it in a Long.
            Long userId = user.getId();
            System.out.println("2. User found. ID is: " + userId);

            // This line now works perfectly because it receives the Long it expects.
            List<McqHistory> history = mcqHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
            System.out.println("3. Database query executed. Found " + history.size() + " history items.");

            if (!history.isEmpty()) {
                System.out.println("4. First history item text: '" + history.get(0).getOriginalText() + "'");
            }

            System.out.println("--- HISTORY ENDPOINT FINISHED SUCCESSFULLY ---");
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            System.out.println("!!! FATAL EXCEPTION in HistoryController: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching history.");
        }
    }
}