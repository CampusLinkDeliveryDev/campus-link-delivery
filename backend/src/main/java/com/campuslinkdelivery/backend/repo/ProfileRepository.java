package com.campuslinkdelivery.backend.repo;

import java.util.Optional;
import java.util.UUID;

import com.campuslinkdelivery.backend.model.Profile;
import org.springframework.data.repository.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ProfileRepository extends Repository<Profile, UUID> {

    Optional<Profile> findById(UUID id);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = """
        UPDATE public.profiles
        SET full_name = :fullName, phone = :phone
        WHERE id = :userId
          AND account_status <> 'suspended'
        """, nativeQuery = true)
    int updateContactDetails(
            @Param("userId") UUID userId,
            @Param("fullName") String fullName,
            @Param("phone") String phone);
}