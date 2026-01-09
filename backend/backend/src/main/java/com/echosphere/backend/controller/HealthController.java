package com.echosphere.backend.controller;

import com.echosphere.backend.service.GeminiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final GeminiService geminiService;

    public HealthController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "service", "EchoSphere Backend",
                "version", "1.0.0"
        );
    }

    // TEMPORARY TEST ENDPOINT
    @GetMapping("/api/test/gemini")
    public String testGemini() {
        return geminiService.generateText("Say hello in one sentence");
    }
}
