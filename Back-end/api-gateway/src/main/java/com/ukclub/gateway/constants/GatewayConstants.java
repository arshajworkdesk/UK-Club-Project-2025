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
    
    // CORS Configuration
    public static final String ORIGIN_HEADER = "Origin";
    public static final String X_REQUESTED_WITH_HEADER = "X-Requested-With";
    public static final String ACCEPT_HEADER = "Accept";
    
    // Allowed origins
    public static final String CORS_ORIGIN_LOCALHOST = "http://localhost:4200";
    public static final String CORS_ORIGIN_PRODUCTION = "https://arshajworkdesk.github.io";
    public static final List<String> CORS_ALLOWED_ORIGINS = Arrays.asList(
            CORS_ORIGIN_LOCALHOST,
            CORS_ORIGIN_PRODUCTION
    );
    
    // Allowed HTTP methods
    public static final String HTTP_METHOD_GET = "GET";
    public static final String HTTP_METHOD_POST = "POST";
    public static final String HTTP_METHOD_PUT = "PUT";
    public static final String HTTP_METHOD_DELETE = "DELETE";
    public static final String HTTP_METHOD_OPTIONS = "OPTIONS";
    public static final String HTTP_METHOD_PATCH = "PATCH";
    public static final List<String> CORS_ALLOWED_METHODS = Arrays.asList(
            HTTP_METHOD_GET,
            HTTP_METHOD_POST,
            HTTP_METHOD_PUT,
            HTTP_METHOD_DELETE,
            HTTP_METHOD_OPTIONS,
            HTTP_METHOD_PATCH
    );
    
    // Allowed headers
    public static final List<String> CORS_ALLOWED_HEADERS = Arrays.asList(
            AUTHORIZATION_HEADER,
            CONTENT_TYPE_HEADER,
            X_REQUESTED_WITH_HEADER,
            ACCEPT_HEADER,
            ORIGIN_HEADER,
            HEADER_USER_ID,
            HEADER_USER_EMAIL,
            HEADER_USER_ROLE
    );
    
    // Exposed headers
    public static final List<String> CORS_EXPOSED_HEADERS = Arrays.asList(
            AUTHORIZATION_HEADER,
            CONTENT_TYPE_HEADER
    );
    
    // CORS preflight cache duration (1 hour in seconds)
    public static final long CORS_MAX_AGE = 3600L;
    
    // Filter order (higher priority = lower number)
    public static final int JWT_FILTER_ORDER = -100;

    // Private constructor to prevent instantiation
    private GatewayConstants() {
        throw new UnsupportedOperationException("Constants class cannot be instantiated");
    }
}

