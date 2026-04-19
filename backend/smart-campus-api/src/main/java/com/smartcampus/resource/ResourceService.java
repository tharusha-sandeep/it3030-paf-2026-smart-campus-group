package com.smartcampus.resource;

import java.util.List;

public interface ResourceService {
    List<ResourceDTO> getAllResources();
    ResourceDTO getResourceById(Long id);
    List<ResourceDTO> searchResources(ResourceType type, Integer minCapacity, Integer maxCapacity, String location);
    ResourceDTO createResource(ResourceDTO dto);
    ResourceDTO updateResource(Long id, ResourceDTO dto);
    void deleteResource(Long id);
}
