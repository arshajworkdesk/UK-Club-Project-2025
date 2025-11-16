package com.ukclub.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private boolean success;
    private String message;
    private AdminInfo admin;
    private String token;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminInfo {
        private Long id;
        private String email;
        private String fullName;
        private String role;
    }
}

