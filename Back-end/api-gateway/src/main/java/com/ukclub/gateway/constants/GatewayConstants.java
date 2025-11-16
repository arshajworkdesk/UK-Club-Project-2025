package com.ukclub.gateway.constants;

import java.util.Arrays;
import java.util.List;

/**
 * Gateway Constants
 * Centralized constants for API Gateway configuration
 */
public class GatewayConstants {

    // Service URLs (will be replaced with service discovery later)
    public static final String AUTH_SERVICE_URL = "http://localhost:8081";
    public static final String MEMBER_SERVICE_URL = "http://localhost:8082";
    public static final String CONTACT_SERVICE_URL = "http://localhost:8083";

    // Public endpoints that don't require JWT authentication
    public static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/api/admin/login",
            "/api/membership/register",
            "/api/members",
            "/api/contact"
    );

    // JWT Authentication constants
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";
    
    // User info header names (passed to downstream services)
    public static final String HEADER_USER_ID = "X-User-Id";
    public static final String HEADER_USER_EMAIL = "X-User-Email";
    public static final String HEADER_USER_ROLE = "X-User-Role";
    
    // HTTP Headers
    public static final String CONTENT_TYPE_HEADER = "Content-Type";
    public static final String CONTENT_TYPE_JSON = "application/json";
    
    // Filter order (higher priority = lower number)
    public static final int JWT_FILTER_ORDER = -100;

    // Private constructor to prevent instantiation
    private GatewayConstants() {
        throw new UnsupportedOperationException("Constants class cannot be instantiated");
    }
}

