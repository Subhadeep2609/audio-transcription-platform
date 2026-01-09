package com.echosphere.backend.service;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AudioChunkStore {

    private final Map<String, List<byte[]>> userChunks = new ConcurrentHashMap<>();

    public void addChunk(String email, byte[] chunk) {
        userChunks
            .computeIfAbsent(email, k -> new ArrayList<>())
            .add(chunk);
    }

    public List<byte[]> getChunks(String email) {
        return userChunks.getOrDefault(email, List.of());
    }

    public void clear(String email) {
        userChunks.remove(email);
    }
}
