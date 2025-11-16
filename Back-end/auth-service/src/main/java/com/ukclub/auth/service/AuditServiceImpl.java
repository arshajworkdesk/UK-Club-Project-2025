package com.ukclub.auth.service;

import com.ukclub.auth.constants.HttpConstants;
import com.ukclub.auth.model.AuditLog;
import com.ukclub.auth.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Audit Service Implementation
 * Logs important actions and changes in the system
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements IAuditService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Log an action to audit log
     */
    @Transactional
    public void logAction(Long userId, String userEmail, String actionType, 
                         String entityType, Long entityId, String description,
                         HttpServletRequest request) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUserId(userId);
        auditLog.setUserEmail(userEmail);
        auditLog.setActionType(actionType);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);

        if (request != null) {
            auditLog.setIpAddress(getClientIpAddress(request));
            auditLog.setUserAgent(request.getHeader(HttpConstants.HEADER_USER_AGENT));
        }

        auditLogRepository.save(auditLog);
        log.debug("Audit log created: {} - {} by user {}", actionType, entityType, userEmail);
    }

    /**
     * Get client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader(HttpConstants.HEADER_X_FORWARDED_FOR);
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(HttpConstants.FORWARDED_IP_SEPARATOR)[0].trim();
        }
        return request.getRemoteAddr();
    }
}

