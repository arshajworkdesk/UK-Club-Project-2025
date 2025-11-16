package com.ukclub.auth.controller;

import com.ukclub.auth.constants.AuditConstants;
import com.ukclub.auth.constants.MessageConstants;
import com.ukclub.auth.dto.LoginRequest;
import com.ukclub.auth.dto.LoginResponse;
import com.ukclub.auth.service.IAuditService;
import com.ukclub.auth.service.IAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles admin login
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
// CORS is handled by API Gateway - no need for @CrossOrigin here
public class AuthController {

    private final IAuthService authService;
    private final IAuditService auditService;

    /**
     * Admin login endpoint
     * POST /api/admin/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        log.info("Login attempt for email: {}", request.getEmail());

        return authService.authenticate(request.getEmail(), request.getPassword())
                .map(member -> {
                    String token = authService.generateToken(member);
                    
                    // Log successful login action
                    auditService.logAction(
                            member.getId(),
                            member.getEmail(),
                            AuditConstants.ACTION_LOGIN,
                            AuditConstants.ENTITY_AUTH,
                            member.getId(),
                            String.format(AuditConstants.DESC_ADMIN_LOGGED_IN, member.getEmail()),
                            httpRequest
                    );
                    
                    LoginResponse.AdminInfo adminInfo = new LoginResponse.AdminInfo(
                            member.getId(),
                            member.getEmail(),
                            member.getFullName(),
                            member.getRole().name()
                    );

                    LoginResponse response = new LoginResponse(
                            true,
                            MessageConstants.SUCCESS_LOGIN,
                            adminInfo,
                            token
                    );

                    log.info("Successful login for admin: {}", member.getEmail());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        new LoginResponse(
                                false,
                                MessageConstants.ERROR_INVALID_CREDENTIALS,
                                null,
                                null
                        )
                ));
    }
}

