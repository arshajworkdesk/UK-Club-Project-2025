package com.ukclub.auth.service;

import com.ukclub.auth.model.Member;

import java.util.Optional;

/**
 * Authentication Service Interface
 * Defines contract for user authentication and login
 */
public interface IAuthService {

    /**
     * Authenticate user and generate JWT token
     * @param email User email
     * @param password User password
     * @return Optional containing authenticated Member if successful, empty otherwise
     */
    Optional<Member> authenticate(String email, String password);

    /**
     * Generate JWT token for member
     * @param member Member entity
     * @return JWT token string
     */
    String generateToken(Member member);
}

