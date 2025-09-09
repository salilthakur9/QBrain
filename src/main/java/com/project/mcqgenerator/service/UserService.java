package com.project.mcqgenerator.service;

import com.project.mcqgenerator.repository.McqHistoryRepository;
import com.project.mcqgenerator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // The magic import

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private McqHistoryRepository mcqHistoryRepository;

    @Transactional // This annotation makes the whole method a single, safe transaction
    public void deleteUserAndHistory(Long userId) {
        // 1. Delete all history for the user
        mcqHistoryRepository.deleteByUserId(userId);
        // 2. Delete the user
        userRepository.deleteById(userId);
    }
}