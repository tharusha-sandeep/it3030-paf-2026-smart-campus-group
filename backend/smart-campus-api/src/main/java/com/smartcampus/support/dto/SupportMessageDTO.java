package com.smartcampus.support.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SupportMessageDTO(
    Long id,
    UUID userId,
    String userEmail,
    String userName,
    String subject,
    String message,
    LocalDateTime createdAt
) {}
