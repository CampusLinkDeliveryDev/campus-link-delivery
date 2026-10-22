package com.campuslinkdelivery.backend.security;
import jakarta.persistence.EnumeratedValue;

public enum Role {
    CUSTOMER("customer"),
    COURIER("courier"),
    ADMIN("admin");

    @EnumeratedValue
    private final String databaseValue;

    Role(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}