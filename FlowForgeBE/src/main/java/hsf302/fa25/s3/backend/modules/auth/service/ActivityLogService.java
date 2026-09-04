package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.entity.User;

import java.util.UUID;

public interface ActivityLogService {
    void logActivity(String action, String entityName, UUID entityId, String details, User performedBy);
}
