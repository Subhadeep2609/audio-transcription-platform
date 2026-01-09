package com.echosphere.backend.controller;

import com.echosphere.backend.service.AudioChunkStore;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/transcribe")
public class TranscriptionChunkController {

    private final AudioChunkStore chunkStore;

    public TranscriptionChunkController(AudioChunkStore chunkStore) {
        this.chunkStore = chunkStore;
    }

    @PostMapping("/chunk")
    public ResponseEntity<Void> receiveChunk(
            @RequestParam("audio") MultipartFile audio
    ) throws Exception {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();

        chunkStore.addChunk(email, audio.getBytes());

        return ResponseEntity.accepted().build();
    }
}
