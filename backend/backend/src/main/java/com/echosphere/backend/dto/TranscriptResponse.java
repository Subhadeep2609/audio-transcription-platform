package com.echosphere.backend.dto;

public class TranscriptResponse {

    public String status;
    public String text;
    public double confidence;

    public TranscriptResponse(String status, String text, double confidence) {
        this.status = status;
        this.text = text;
        this.confidence = confidence;
    }
}
