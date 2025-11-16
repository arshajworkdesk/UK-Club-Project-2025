package com.ukclub.auth.service;

import io.jsonwebtoken.Claims;

/**
 * JWT Token Provider Interface
 * Defines contract for JWT token generation and validation
 */
public interface IJwtTokenProvider {

    /**
     * Generate JWT token for user
     * @param userId User ID
     * @param email User email
     * @param role User role
     * @return JWT token string
     */
    String generateToken(Long userId, String email, String role);

    /**
     * Validate JWT token
     * @param token JWT token string
     * @return Claims extracted from token
     * @throws io.jsonwebtoken.JwtException if token is invalid
     */
    Claims validateToken(String token);

    /**
     * Get user ID from token
     * @param token JWT token string
     * @return User ID
     */
    Long getUserIdFromToken(String token);

    /**
     * Get email from token
     * @param token JWT token string
     * @return User email
     */
    String getEmailFromToken(String token);

    /**
     * Get role from token
     * @param token JWT token string
     * @return User role
     */
    String getRoleFromToken(String token);
}

