package com.echosphere.backend.controller;

import com.echosphere.backend.transcription.TranscriptionStreamer;
import org.springframework.security.core.context.SecurityContextHolder;
import com.echosphere.backend.dto.TranscriptResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/transcribe")
public class TranscriptionController {

    private final TranscriptionStreamer streamer;

    public TranscriptionController(TranscriptionStreamer streamer) {
        this.streamer = streamer;
    }

    @PostMapping
    public void startTranscription() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        streamer.startStreaming(email);
    }
}
