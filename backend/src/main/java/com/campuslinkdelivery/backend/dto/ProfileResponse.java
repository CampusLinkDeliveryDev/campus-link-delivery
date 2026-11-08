package com.campuslinkdelivery.backend.dto;

import com.campuslinkdelivery.backend.model.AccountStatus;
import com.campuslinkdelivery.backend.model.Profile;
import com.campuslinkdelivery.backend.security.Role;
import com.fasterxml.jackson.annotation.JsonProperty;

public record ProfileResponse(
        /*
        * @JsonProperty keeps the Java names in camel case and gives
        * the JSON the exact names required by the issue. The response
        * leaves out the profile ID and timestamps.
        * */
        @JsonProperty("full_name") String fullName,
        String email,
        String phone,
        Role role,
        @JsonProperty("account_status") AccountStatus accountStatus,
        @JsonProperty("is_available") boolean available
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getFullName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getRole(),
                profile.getAccountStatus(),
                profile.isAvailable()
        );
    }
}