package com.echosphere.backend.controller;

import com.echosphere.backend.dto.TranscriptResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TranscriptionController {

    @PostMapping("/transcribe")
    public TranscriptResponse transcribe(
            @RequestPart("audio") MultipartFile audio,
            Authentication authentication
    ) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        String email = authentication.getName(); // extracted from JWT

        // 🔹 TEMP: Dummy transcription (Step 1)
        return new TranscriptResponse(
                "completed",
                "Audio received successfully for user " + email +
                        " (file: " + audio.getOriginalFilename() + ")",
                0.93
        );
    }
}
