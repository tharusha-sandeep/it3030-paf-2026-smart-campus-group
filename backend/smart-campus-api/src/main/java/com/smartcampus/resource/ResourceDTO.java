package com.smartcampus.resource;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO {
    
    private Long id;

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @Min(value = 0, message = "Capacity cannot be negative")
    private Integer capacity;

    private String location;

    private String availabilityWindows;

    private String description;

    @NotNull(message = "Resource status is required")
    private ResourceStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
