package com.ukclub.auth.constants;

/**
 * Constants for audit logging actions and entity types
 */
public final class AuditConstants {

    private AuditConstants() {
        // Prevent instantiation
    }

    // Action Types
    public static final String ACTION_LOGIN = "LOGIN";

    // Entity Types
    public static final String ENTITY_AUTH = "AUTH";

    // Description Templates
    public static final String DESC_ADMIN_LOGGED_IN = "Admin logged in: %s";
}

