package com.campuslinkdelivery.backend.controller;

import java.util.UUID;

import com.campuslinkdelivery.backend.dto.ProfileResponse;
import com.campuslinkdelivery.backend.model.AccountStatus;
import com.campuslinkdelivery.backend.model.Profile;
import com.campuslinkdelivery.backend.repo.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.campuslinkdelivery.backend.dto.ProfileUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
public class ProfileController {

    private final ProfileRepository profileRepository;

    public ProfileController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping("/api/me")
    public ProfileResponse getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ProfileResponse.from(requireUsableProfile(userId));
    }

    @PutMapping("/api/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ProfileUpdateRequest request) {

        UUID userId = UUID.fromString(jwt.getSubject());
        requireUsableProfile(userId);

        int updated = profileRepository.updateContactDetails(
                userId, request.fullName(), request.phone());

        if (updated == 0) {
            // Check whether the profile was suspended or removed before the update.
            requireUsableProfile(userId);
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Profile could not be updated");
        }
    }

    private Profile requireUsableProfile(UUID userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Profile not found"));

        if (profile.getAccountStatus() == AccountStatus.suspended) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Account is suspended");
        }

        return profile;
    }
}