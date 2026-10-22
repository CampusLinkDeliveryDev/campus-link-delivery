package com.campuslinkdelivery.backend;

import java.time.Instant;

import com.campuslinkdelivery.backend.config.SecurityConfig;
import com.campuslinkdelivery.backend.controller.SecurityTestController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.campuslinkdelivery.backend.repo.ProfileRepository;

import java.util.Optional;
import java.util.UUID;

import com.campuslinkdelivery.backend.model.Profile;
import com.campuslinkdelivery.backend.security.Role;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.mockito.Mockito.mock;



@WebMvcTest(
        controllers = SecurityTestController.class,
        properties = {
                "spring.config.import=",
                "app.cors.allowed-origins=http://localhost:5173",
                "spring.security.oauth2.resourceserver.jwt.issuer-uri=https://issuer.example",
                "spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://issuer.example/jwks"
        }
)
@Import(SecurityConfig.class)
class SecurityConfigTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @MockitoBean
    private ProfileRepository profileRepository;

    @Test
    void missingTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/security/test"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectedTokenReturnsUnauthorized() throws Exception {
        when(jwtDecoder.decode("rejected-token"))
                .thenThrow(new BadJwtException("Invalid token"));

        mockMvc.perform(get("/api/security/test")
                        .header("Authorization", "Bearer rejected-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void acceptedTokenAllowsRequest() throws Exception {
        Instant now = Instant.now();

        Jwt jwt = Jwt.withTokenValue("accepted-token")
                .header("alg", "ES256")
                .subject("00000000-0000-0000-0000-000000000001")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(300))
                .build();

        when(jwtDecoder.decode("accepted-token")).thenReturn(jwt);

        mockMvc.perform(get("/api/security/test")
                        .header("Authorization", "Bearer accepted-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Authentication successful"))
                .andExpect(header().doesNotExist("Set-Cookie"));
    }

    @Test
    void allowedOriginPreflightSucceedsWithoutToken() throws Exception {
        mockMvc.perform(options("/api/security/test")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(
                        "Access-Control-Allow-Origin",
                        "http://localhost:5173"));
    }

    @Test
    void unapprovedOriginPreflightIsRejected() throws Exception {
        mockMvc.perform(options("/api/security/test")
                        .header("Origin", "https://untrusted.example")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "authorization"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(
                        "Access-Control-Allow-Origin"));
    }

    @Test
    void adminCanAccessAdminEndpoint() throws Exception {
        acceptTokenWithRole(Role.ADMIN);

        mockMvc.perform(get("/api/security/test/admin")
                        .header("Authorization", "Bearer role-test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Admin access successful"));
    }

    @ParameterizedTest
    @EnumSource(value = Role.class, names = {"CUSTOMER", "COURIER"})
    void nonAdminCannotAccessAdminEndpoint(Role role) throws Exception {
        acceptTokenWithRole(role);

        mockMvc.perform(get("/api/security/test/admin")
                        .header("Authorization", "Bearer role-test-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void missingProfileCannotAccessAdminEndpoint() throws Exception {
        acceptTokenWithRole(null);

        mockMvc.perform(get("/api/security/test/admin")
                        .header("Authorization", "Bearer role-test-token"))
                .andExpect(status().isForbidden());
    }

    private void acceptTokenWithRole(Role role) {
        UUID userId =
                UUID.fromString("00000000-0000-0000-0000-000000000001");
        Instant now = Instant.now();

        Jwt jwt = Jwt.withTokenValue("role-test-token")
                .header("alg", "ES256")
                .subject(userId.toString())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(300))
                .build();

        when(jwtDecoder.decode("role-test-token")).thenReturn(jwt);

        if (role == null) {
            when(profileRepository.findById(userId))
                    .thenReturn(Optional.empty());
        } else {
            Profile profile = mock(Profile.class);
            when(profile.getRole()).thenReturn(role);
            when(profileRepository.findById(userId))
                    .thenReturn(Optional.of(profile));
        }
    }

    @Test
    void protectedResponseIncludesSecurityHeaders() throws Exception {
        mockMvc.perform(get("/api/security/test"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(
                        "X-Content-Type-Options", "nosniff"))
                .andExpect(header().string(
                        "X-Frame-Options", "DENY"))
                .andExpect(header().string(
                        "Cache-Control",
                        "no-cache, no-store, max-age=0, must-revalidate"));
    }
}