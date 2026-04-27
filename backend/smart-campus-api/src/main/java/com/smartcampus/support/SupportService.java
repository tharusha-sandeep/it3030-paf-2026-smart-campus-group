package com.smartcampus.support;

import com.smartcampus.support.dto.SupportMessageDTO;
import com.smartcampus.user.AppUser;
import com.smartcampus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportMessageRepository repository;
    private final UserRepository userRepository;

    @Transactional
    public SupportMessageDTO saveMessage(String subject, String message, String userId) {
        AppUser user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportMessage msg = SupportMessage.builder()
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .subject(subject)
                .message(message)
                .build();

        return mapToDTO(repository.save(msg));
    }

    public List<SupportMessageDTO> getAllMessages() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private SupportMessageDTO mapToDTO(SupportMessage msg) {
        return new SupportMessageDTO(
                msg.getId(),
                msg.getUserId(),
                msg.getUserEmail(),
                msg.getUserName(),
                msg.getSubject(),
                msg.getMessage(),
                msg.getCreatedAt()
        );
    }
}
