package com.ukclub.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security Configuration for API Gateway
 * Allows public endpoints and requires JWT for protected endpoints
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for API Gateway
                .authorizeExchange(exchanges -> exchanges
                        // Allow all requests - JWT filter will handle authentication
                        .anyExchange().permitAll()
                );
        
        return http.build();
    }
}

