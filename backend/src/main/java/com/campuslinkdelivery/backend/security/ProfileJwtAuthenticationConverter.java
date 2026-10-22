package com.campuslinkdelivery.backend.security;

import java.util.List;
import java.util.UUID;

import com.campuslinkdelivery.backend.repo.ProfileRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class ProfileJwtAuthenticationConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    private final ProfileRepository profileRepository;

    public ProfileJwtAuthenticationConverter(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        UUID userId = parseUserId(jwt.getSubject());

        List<GrantedAuthority> authorities = profileRepository.findById(userId)
                .map(profile -> List.<GrantedAuthority>of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + profile.getRole().name())))
                .orElseGet(List::of);

        return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
    }

    private UUID parseUserId(String subject) {
        if (subject == null) {
            throw invalidSubject();
        }

        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException exception) {
            throw invalidSubject();
        }
    }

    private OAuth2AuthenticationException invalidSubject() {
        return new OAuth2AuthenticationException(
                new OAuth2Error("invalid_token"),
                "Token subject must be a user UUID");
    }
}