package com.project.mcqgenerator.repository;

import com.project.mcqgenerator.model.McqHistory;
import org.springframework.data.jpa.repository.JpaRepository; // <-- Change import to JPA
import java.util.List;

// Extend JpaRepository and change ID type to Long
public interface McqHistoryRepository extends JpaRepository<McqHistory, Long> {

    // IMPORTANT: The userId parameter must also be changed from String to Long
    // to match our updated McqHistory entity.
    List<McqHistory> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Also change this to Long
    void deleteByUserId(Long userId);
}