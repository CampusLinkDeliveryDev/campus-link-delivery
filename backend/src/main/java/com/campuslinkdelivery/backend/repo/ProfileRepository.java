package com.campuslinkdelivery.backend.repo;

import java.util.Optional;
import java.util.UUID;

import com.campuslinkdelivery.backend.model.Profile;
import org.springframework.data.repository.Repository;

public interface ProfileRepository extends Repository<Profile, UUID> {

    Optional<Profile> findById(UUID id);
}