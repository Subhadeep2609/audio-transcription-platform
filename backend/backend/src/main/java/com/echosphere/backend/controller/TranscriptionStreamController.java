package com.echosphere.backend.controller;

import com.echosphere.backend.util.JwtUtil;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/transcribe")
public class TranscriptionStreamController {

    private final JwtUtil jwtUtil;

    public TranscriptionStreamController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamTranscription(@RequestParam("token") String token) {

        // ✅ MANUAL JWT VALIDATION
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid JWT");
        }

        String email = jwtUtil.extractEmail(token);

        SseEmitter emitter = new SseEmitter(0L); // no timeout

        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                String[] chunks = {
                        "Starting transcription...",
                        "Analyzing audio input...",
                        "Detecting speech patterns...",
                        "Generating transcript...",
                        "Transcription completed for " + email
                };

                for (String chunk : chunks) {
                    emitter.send(SseEmitter.event()
                            .name("transcript")
                            .data(chunk));
                    Thread.sleep(1000);
                }
                emitter.send(SseEmitter.event().name("complete").data("done"));
                emitter.complete();

            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}
