package com.ukclub.auth.repository;

import com.ukclub.auth.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Member Repository
 * Data access layer for Member entity
 */
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    /**
     * Find member by email
     */
    Optional<Member> findByEmail(String email);

    /**
     * Find members by role
     */
    List<Member> findByRole(Member.Role role);

    /**
     * Find members by approval status
     */
    List<Member> findByApprovalStatus(Member.ApprovalStatus approvalStatus);

    /**
     * Find members by role and approval status
     */
    List<Member> findByRoleAndApprovalStatus(Member.Role role, Member.ApprovalStatus approvalStatus);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
}

