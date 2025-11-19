package com.ukclub.auth.service;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Audit Service Interface
 * Defines contract for audit logging operations
 */
public interface IAuditService {

    /**
     * Log an action to audit log
     * @param userId User ID performing the action
     * @param userEmail User email performing the action
     * @param actionType Type of action (e.g., "APPROVE", "REJECT", "ASSIGN_ADMIN")
     * @param entityType Type of entity affected (e.g., "MEMBER")
     * @param entityId ID of entity affected
     * @param description Description of the action
     * @param request HTTP request for extracting IP address and user agent
     */
    void logAction(Long userId, String userEmail, String actionType,
                   String entityType, Long entityId, String description,
                   HttpServletRequest request);
}

