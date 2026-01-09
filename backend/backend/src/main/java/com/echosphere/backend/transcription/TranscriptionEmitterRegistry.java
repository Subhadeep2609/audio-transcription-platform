package com.echosphere.backend.transcription;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class TranscriptionEmitterRegistry {

    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void add(String user, SseEmitter emitter) {
        emitters.put(user, emitter);
    }

    public void remove(String user) {
        emitters.remove(user);
    }

    public SseEmitter get(String user) {
        return emitters.get(user);
    }
}
