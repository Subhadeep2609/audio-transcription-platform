package com.echosphere.backend.controller;

import com.echosphere.backend.dto.LoginRequest;
import com.echosphere.backend.dto.LoginResponse;
import com.echosphere.backend.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Temporary mock authentication
        if (request.email == null || request.password == null) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = JwtUtil.generateToken(request.email);
        return new LoginResponse(token);
    }
}
