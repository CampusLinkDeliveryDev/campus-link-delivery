package com.campuslinkdelivery.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(
        @JsonProperty("full_name") @NotBlank String fullName,
        String phone
) {
}