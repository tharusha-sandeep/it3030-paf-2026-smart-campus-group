package com.smartcampus.auth.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponseDTO(
    UUID id,
    String name,
    String email,
    String role,
    String profilePicture,
    LocalDateTime createdAt
) {}
