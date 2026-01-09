package com.echosphere.backend.service;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SseSessionRegistry {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void register(String email, SseEmitter emitter) {
        emitters.put(email, emitter);
    }

    public void remove(String email) {
        emitters.remove(email);
    }

    public SseEmitter get(String email) {
        return emitters.get(email);
    }
}
