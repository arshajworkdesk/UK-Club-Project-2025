package com.ukclub.gateway.filter;

import com.ukclub.gateway.constants.GatewayConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * JWT Authentication Filter
 * Validates JWT tokens for protected endpoints
 * Skips validation for public endpoints
 * 
 * Like a bouncer at a club: checks your ID (JWT) at the door, and if valid, gives you a wristband (headers) 
 * so you don’t need to show ID again inside.
 */
@Slf4j
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret:your-256-bit-secret-key-change-this-in-production-minimum-32-characters}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Skip JWT validation for public endpoints
        if (isPublicEndpoint(path)) {
            return chain.filter(exchange);
        }

        // Extract token from Authorization header
        String token = extractToken(request);
        
        if (token == null || token.isEmpty()) {
            return onError(exchange, "Missing or invalid authorization token", HttpStatus.UNAUTHORIZED);
        }

        try {
            // Validate token
            Claims claims = validateToken(token);
            
            // Add user info to request headers for downstream services
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header(GatewayConstants.HEADER_USER_ID, String.valueOf(claims.get("userId")))
                    .header(GatewayConstants.HEADER_USER_EMAIL, claims.getSubject())
                    .header(GatewayConstants.HEADER_USER_ROLE, (String) claims.get("role"))
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
            
        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Check if endpoint is public (no JWT required)
     */
    private boolean isPublicEndpoint(String path) {
        return GatewayConstants.PUBLIC_ENDPOINTS.stream().anyMatch(path::startsWith);
    }

    /**
     * Extract JWT token from Authorization header
     */
    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst(GatewayConstants.AUTHORIZATION_HEADER);
        
        if (authHeader != null && authHeader.startsWith(GatewayConstants.BEARER_PREFIX)) {
            return authHeader.substring(GatewayConstants.BEARER_PREFIX.length());
        }
        
        return null;
    }

    /**
     * Validate JWT token and extract claims
     */
    private Claims validateToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Handle authentication errors
     */
    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add(GatewayConstants.CONTENT_TYPE_HEADER, GatewayConstants.CONTENT_TYPE_JSON);
        
        String errorBody = String.format("{\"success\": false, \"message\": \"%s\"}", message);
        
        return response.writeWith(
                Mono.just(response.bufferFactory().wrap(errorBody.getBytes(StandardCharsets.UTF_8)))
        );
    }

    @Override
    public int getOrder() {
        // Set high priority to run before other filters
        return GatewayConstants.JWT_FILTER_ORDER;
    }
}

