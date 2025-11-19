package com.ukclub.auth.repository;

import com.ukclub.auth.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Audit Log Repository
 * Data access layer for AuditLog entity
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Find audit logs by user ID
     */
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find audit logs by action type
     */
    List<AuditLog> findByActionTypeOrderByCreatedAtDesc(String actionType);

    /**
     * Find audit logs by entity type and entity ID
     */
    List<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
}

