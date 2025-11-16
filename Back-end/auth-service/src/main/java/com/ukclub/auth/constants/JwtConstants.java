package com.ukclub.auth.constants;

/**
 * Constants for JWT token claims and configuration
 */
public final class JwtConstants {

    private JwtConstants() {
        // Prevent instantiation
    }

    // JWT Claim Keys
    public static final String CLAIM_USER_ID = "userId";
    public static final String CLAIM_ROLE = "role";

    // Default Configuration Values
    public static final String DEFAULT_SECRET = "your-256-bit-secret-key-change-this-in-production-minimum-32-characters";
    public static final long DEFAULT_EXPIRATION_MS = 3600000L; // 1 hour in milliseconds
}

