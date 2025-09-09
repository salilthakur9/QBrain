package com.project.mcqgenerator.repository;

import com.project.mcqgenerator.model.User;
import org.springframework.data.jpa.repository.JpaRepository; // <-- IMPORTANT: Import JpaRepository
import java.util.Optional;

// Extend JpaRepository and change the ID type from String to Long
public interface UserRepository extends JpaRepository<User, Long> {

    // This method will work perfectly with JPA, no changes needed here.
    // Spring Data JPA will automatically create the correct SQL query from this method name.
    Optional<User> findByEmail(String email);
}