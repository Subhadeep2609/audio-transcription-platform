package com.echosphere.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ❌ CSRF not needed for JWT
            .csrf(csrf -> csrf.disable())
            
            // ✅ ENABLE CORS (VERY IMPORTANT)
            .cors(cors -> {})
            
            // ✅ AUTHORIZE REQUESTS
            .authorizeHttpRequests(auth -> auth
                // ✅ allow preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ public auth endpoints
                .requestMatchers("/api/auth/**", "/api/health","/api/transcribe/stream","/api/test/gemini").permitAll()
                // 🔐 everything else requires JWT
                .anyRequest().authenticated()
            )

            // ✅ JWT filter AFTER CORS
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
