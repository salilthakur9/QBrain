package com.project.mcqgenerator.model;

import jakarta.persistence.*; // Import from jakarta.persistence
import lombok.Data;

@Data
@Entity // Use @Entity instead of @Document
@Table(name = "users") // Specifies the table name
public class User {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tells MySQL to auto-increment this value
    private Long id; // Use Long for auto-incrementing IDs in SQL

    private String name;

    @Column(unique = true) // Ensures no two users can have the same email
    private String email;

    private String password;
}