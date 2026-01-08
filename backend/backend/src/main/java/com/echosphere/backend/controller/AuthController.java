package com.echosphere.backend.controller;

import com.echosphere.backend.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        // (For assignment/demo purpose only – no DB yet)
        String token = jwtUtil.generateToken(email);

        return Map.of("token", token);
    }
}
