package com.project.mcqgenerator.controller;

import com.project.mcqgenerator.model.User;
import com.project.mcqgenerator.repository.UserRepository;
import com.project.mcqgenerator.security.JwtUtil;
import com.project.mcqgenerator.service.UserService; // Import the new service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService; // Autowire the new service

    // I'm removing the update-name endpoint from this example for clarity,
    // but you can keep it in your file.

    @DeleteMapping("/me") // Changed path to /me for clarity, but /delete is also fine
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }

        // Call the single, safe method from our service
        userService.deleteUserAndHistory(userOptional.get().getId());

        return ResponseEntity.ok("User account and all associated data deleted successfully.");
    }
}