package com.echosphere.backend.controller;

import com.echosphere.backend.dto.TranscriptRequest;
import com.echosphere.backend.dto.TranscriptResponse;
import com.echosphere.backend.service.GeminiService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transcribe")
public class TranscriptionController {

    private final GeminiService geminiService;

    public TranscriptionController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public TranscriptResponse transcribe(@RequestBody TranscriptRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        String result = geminiService.generateText(
                "Clean and summarize this transcript:\n" + request.text()
        );

        return new TranscriptResponse(result);
    }
}
