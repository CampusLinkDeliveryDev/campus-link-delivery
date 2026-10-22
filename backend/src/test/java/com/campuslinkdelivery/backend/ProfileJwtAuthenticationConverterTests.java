package com.campuslinkdelivery.backend;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.campuslinkdelivery.backend.model.Profile;
import com.campuslinkdelivery.backend.repo.ProfileRepository;
import com.campuslinkdelivery.backend.security.ProfileJwtAuthenticationConverter;
import com.campuslinkdelivery.backend.security.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.jwt.Jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileJwtAuthenticationConverterTests {

    private static final UUID USER_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Mock
    private ProfileRepository profileRepository;

    private ProfileJwtAuthenticationConverter converter;

    @BeforeEach
    void setUp() {
        converter = new ProfileJwtAuthenticationConverter(profileRepository);
    }

    @ParameterizedTest
    @EnumSource(Role.class)
    void profileRoleBecomesMatchingAuthority(Role role) {
        Profile profile = mock(Profile.class);
        when(profile.getRole()).thenReturn(role);
        when(profileRepository.findById(USER_ID))
                .thenReturn(Optional.of(profile));

        var authentication = converter.convert(createJwt(USER_ID.toString()));

        assertNotNull(authentication);
        assertTrue(authentication.isAuthenticated());
        assertEquals(USER_ID.toString(), authentication.getName());
        assertEquals(
                List.of("ROLE_" + role.name()),
                authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList()
        );

        verify(profileRepository).findById(USER_ID);
    }

    @Test
    void missingProfileReceivesNoRole() {
        when(profileRepository.findById(USER_ID))
                .thenReturn(Optional.empty());

        var authentication = converter.convert(createJwt(USER_ID.toString()));

        assertNotNull(authentication);
        assertTrue(authentication.isAuthenticated());
        assertTrue(authentication.getAuthorities().isEmpty());
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"not-a-uuid"})
    void invalidSubjectIsRejectedBeforeDatabaseLookup(String subject) {
        var exception = assertThrows(
                OAuth2AuthenticationException.class,
                () -> converter.convert(createJwt(subject))
        );

        assertEquals("invalid_token", exception.getError().getErrorCode());
        verifyNoInteractions(profileRepository);
    }

    private Jwt createJwt(String subject) {
        Instant now = Instant.now();

        Jwt.Builder builder = Jwt.withTokenValue("test-token")
                .header("alg", "ES256")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(300));

        if (subject != null) {
            builder.subject(subject);
        }

        return builder.build();
    }
}