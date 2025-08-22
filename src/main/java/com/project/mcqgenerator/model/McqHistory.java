package com.project.mcqgenerator.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "mcq_history")
public class McqHistory {
    @Id
    private String id;
    private String userId; // To link this entry to a specific user
    private String originalText;
    private String generatedMcqs; // We will store the generated questions as a JSON string
    private LocalDateTime createdAt;
}