package com.ukclub.gateway.config;

import com.ukclub.gateway.constants.GatewayConstants;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Gateway Route Configuration
 * Defines routes to backend services
 */
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Public Routes (No JWT Required)
                
                // Admin Login - Public
                .route("admin-login", r -> r
                        .path("/api/admin/login")
                        .uri(GatewayConstants.AUTH_SERVICE_URL))
                
                // Member Registration - Public
                .route("member-register", r -> r
                        .path("/api/membership/register")
                        .uri(GatewayConstants.MEMBER_SERVICE_URL))
                
                // Get Approved Members - Public
                .route("members-public", r -> r
                        .path("/api/members")
                        .uri(GatewayConstants.MEMBER_SERVICE_URL))
                
                // Contact Form - Public
                .route("contact", r -> r
                        .path("/api/contact")
                        .uri(GatewayConstants.CONTACT_SERVICE_URL))
                
                .build();
    }
}

