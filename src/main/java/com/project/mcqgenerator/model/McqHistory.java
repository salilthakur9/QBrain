package com.project.mcqgenerator.model;

import jakarta.persistence.*; // Import from jakarta.persistence
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity // Use @Entity instead of @Document
@Table(name = "mcq_history") // Specifies the table name
public class McqHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // This will store the ID of the User

    // Use @Column(columnDefinition = "TEXT") for potentially very long strings
    // The default VARCHAR(255) might be too short for the original text.
    @Column(columnDefinition = "TEXT")
    private String originalText;

    @Column(columnDefinition = "TEXT")
    private String generatedMcqs;

    private LocalDateTime createdAt;
}