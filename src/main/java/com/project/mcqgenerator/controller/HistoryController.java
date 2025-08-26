package com.project.mcqgenerator.controller;

import com.project.mcqgenerator.model.McqHistory;
import com.project.mcqgenerator.repository.McqHistoryRepository;
import com.project.mcqgenerator.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.project.mcqgenerator.model.User;
import com.project.mcqgenerator.repository.UserRepository;


import java.util.List;

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
        // Remove "Bearer " prefix to get the actual token
        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<McqHistory> history = mcqHistoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return ResponseEntity.ok(history);
    }
}