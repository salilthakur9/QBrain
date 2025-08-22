package com.project.mcqgenerator.repository;

import com.project.mcqgenerator.model.McqHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface McqHistoryRepository extends MongoRepository<McqHistory, String> {
    List<McqHistory> findByUserIdOrderByCreatedAtDesc(String userId);
}