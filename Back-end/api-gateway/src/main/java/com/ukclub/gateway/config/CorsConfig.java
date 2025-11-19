package com.ukclub.gateway.config;

import com.ukclub.gateway.constants.GatewayConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

/**
 * CORS Configuration
 * Allows Angular frontend to communicate with the gateway
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allowed origins
        corsConfig.setAllowedOrigins(GatewayConstants.CORS_ALLOWED_ORIGINS);
        
        // Allowed HTTP methods
        corsConfig.setAllowedMethods(GatewayConstants.CORS_ALLOWED_METHODS);
        
        // Allowed headers
        corsConfig.setAllowedHeaders(GatewayConstants.CORS_ALLOWED_HEADERS);
        
        // Allow credentials (cookies, authorization headers)
        corsConfig.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        corsConfig.setMaxAge(GatewayConstants.CORS_MAX_AGE);
        
        // Exposed headers
        corsConfig.setExposedHeaders(GatewayConstants.CORS_EXPOSED_HEADERS);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}

