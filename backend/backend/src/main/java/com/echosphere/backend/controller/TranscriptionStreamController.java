package com.echosphere.backend.controller;

import com.echosphere.backend.service.GeminiService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/transcribe")
public class TranscriptionStreamController {

    private final GeminiService geminiService;

    public TranscriptionStreamController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamTranscription() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        String email = auth.getName();

        SseEmitter emitter = new SseEmitter(0L);

        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                
                String geminiResponse =
                        geminiService.generateText(
                                "Transcribe and summarize spoken audio for user: " + email
                        );

                
                for (String line : geminiResponse.split("\\n")) {
                    emitter.send(SseEmitter.event()
                            .name("transcript")
                            .data(line));
                    Thread.sleep(300);
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
