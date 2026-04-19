package com.smartcampus.resource;

import com.smartcampus.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repository;

    public ResourceServiceImpl(ResourceRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ResourceDTO> getAllResources() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceDTO getResourceById(Long id) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return mapToDTO(resource);
    }

    @Override
    public List<ResourceDTO> searchResources(ResourceType type, Integer minCapacity, Integer maxCapacity, String location) {
        return repository.searchResources(type, minCapacity, maxCapacity, location).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResourceDTO createResource(ResourceDTO dto) {
        Resource resource = mapToEntity(dto);
        Resource saved = repository.save(resource);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public ResourceDTO updateResource(Long id, ResourceDTO dto) {
        Resource existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setCapacity(dto.getCapacity());
        existing.setLocation(dto.getLocation());
        existing.setAvailabilityWindows(dto.getAvailabilityWindows());
        existing.setDescription(dto.getDescription());
        existing.setStatus(dto.getStatus());

        Resource updated = repository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteResource(Long id) {
        Resource existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        repository.delete(existing);
    }

    private ResourceDTO mapToDTO(Resource entity) {
        return ResourceDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .capacity(entity.getCapacity())
                .location(entity.getLocation())
                .availabilityWindows(entity.getAvailabilityWindows())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private Resource mapToEntity(ResourceDTO dto) {
        return Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .availabilityWindows(dto.getAvailabilityWindows())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .build();
    }
}
