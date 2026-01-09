package com.echosphere.backend.transcription;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class TranscriptionStreamer {

    private final TranscriptionEmitterRegistry registry;

    public TranscriptionStreamer(TranscriptionEmitterRegistry registry) {
        this.registry = registry;
    }

    public void startStreaming(String user) {
        SseEmitter emitter = registry.get(user);
        if (emitter == null) return;

        new Thread(() -> {
            try {
                String[] chunks = {
                    "Starting transcription...",
                    "Analyzing audio input...",
                    "Detecting speech patterns...",
                    "Generating transcript...",
                    "Transcription completed."
                };

                for (String chunk : chunks) {
                    emitter.send(SseEmitter.event()
                            .name("transcript")
                            .data(chunk));
                    Thread.sleep(1000);
                }

                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }).start();
    }
}
