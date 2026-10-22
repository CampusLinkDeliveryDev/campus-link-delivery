package com.campuslinkdelivery.backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

@RestController
public class SecurityTestController {

    @GetMapping("/api/security/test")
    public Map<String, Object> testAuthentication(Authentication authentication) {
        return Map.of(
                "message", "Authentication successful",
                "authorities", authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList()
        );
    }

    @GetMapping("/api/security/test/admin")
    public Map<String, String> testAdminAccess() {
        return Map.of("message", "Admin access successful");
    }
}