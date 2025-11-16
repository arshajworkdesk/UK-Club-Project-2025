package com.ukclub.auth.service;

import com.ukclub.auth.constants.JwtConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT Token Provider Implementation
 * Generates and validates JWT tokens
 */
@Slf4j
@Service
public class JwtTokenProviderImpl implements IJwtTokenProvider {

    @Value("${jwt.secret:your-256-bit-secret-key-change-this-in-production-minimum-32-characters}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}") // 1 hour in milliseconds
    private long jwtExpiration;

    /**
     * Generate JWT token for user
     */
    public String generateToken(Long userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtConstants.CLAIM_USER_ID, userId);
        claims.put(JwtConstants.CLAIM_ROLE, role);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    /**
     * Validate JWT token
     */
    public Claims validateToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Get user ID from token
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.get(JwtConstants.CLAIM_USER_ID, Long.class);
    }

    /**
     * Get email from token
     */
    public String getEmailFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }

    /**
     * Get role from token
     */
    public String getRoleFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.get(JwtConstants.CLAIM_ROLE, String.class);
    }
}

