package com.smartcampus.support;

import com.smartcampus.support.dto.SupportMessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupportController {

    private final SupportService supportService;

    @PostMapping("/messages")
    public ResponseEntity<SupportMessageDTO> postMessage(@RequestBody Map<String, String> body, Authentication authentication) {
        String userId = authentication.getName();
        String subject = body.get("subject");
        String message = body.get("message");
        
        return ResponseEntity.ok(supportService.saveMessage(subject, message, userId));
    }

    @GetMapping("/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupportMessageDTO>> getAllMessages() {
        return ResponseEntity.ok(supportService.getAllMessages());
    }
}
