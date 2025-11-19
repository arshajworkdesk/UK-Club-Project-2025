package com.ukclub.auth.service;

import com.ukclub.auth.model.Member;
import com.ukclub.auth.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Authentication Service Implementation
 * Handles user authentication and login
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final IJwtTokenProvider jwtTokenProvider;

    /**
     * Authenticate user and generate JWT token
     */
    @Transactional(readOnly = true)
    public Optional<Member> authenticate(String email, String password) {
        Optional<Member> memberOpt = memberRepository.findByEmail(email);

        if (memberOpt.isEmpty()) {
            log.warn("Login attempt with non-existent email: {}", email);
            return Optional.empty();
        }

        Member member = memberOpt.get();

        // Verify password
        if (!passwordEncoder.matches(password, member.getPasswordHash())) {
            log.warn("Invalid password attempt for email: {}", email);
            return Optional.empty();
        }

        // Check if user is admin
        if (member.getRole() != Member.Role.admin) {
            log.warn("Login attempt by non-admin user: {}", email);
            return Optional.empty();
        }

        log.info("Successful login for admin: {}", email);
        return Optional.of(member);
    }

    /**
     * Generate JWT token for member
     */
    public String generateToken(Member member) {
        return jwtTokenProvider.generateToken(
                member.getId(),
                member.getEmail(),
                member.getRole().name()
        );
    }
}

