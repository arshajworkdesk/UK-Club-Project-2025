package com.ukclub.auth.constants;

/**
 * Constants for HTTP headers and related values
 */
public final class HttpConstants {

    private HttpConstants() {
        // Prevent instantiation
    }

    // Request Headers (from API Gateway)
    public static final String HEADER_X_USER_ID = "X-User-Id";
    public static final String HEADER_X_USER_EMAIL = "X-User-Email";
    public static final String HEADER_X_USER_ROLE = "X-User-Role";

    // Forwarded Headers
    public static final String HEADER_X_FORWARDED_FOR = "X-Forwarded-For";
    public static final String HEADER_USER_AGENT = "User-Agent";

    // Header Value Separators
    public static final String FORWARDED_IP_SEPARATOR = ",";
}

