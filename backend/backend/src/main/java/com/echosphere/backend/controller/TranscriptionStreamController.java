package com.echosphere.backend.controller;

import com.echosphere.backend.transcription.TranscriptionEmitterRegistry;
import com.echosphere.backend.service.SseSessionRegistry;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/transcribe")
public class TranscriptionStreamController {

    private final TranscriptionEmitterRegistry registry;

    public TranscriptionStreamController(TranscriptionEmitterRegistry registry) {
        this.registry = registry;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        String email = auth.getName();

        SseEmitter emitter = new SseEmitter(0L);
        registry.add(email, emitter);

        emitter.onCompletion(() -> registry.remove(email));
        emitter.onTimeout(() -> registry.remove(email));
        emitter.onError(e -> registry.remove(email));

        return emitter;
    }
}
