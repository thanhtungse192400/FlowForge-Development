package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.modules.auth.entity.ActivityLog;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.repository.ActivityLogRepository;
import hsf302.fa25.s3.backend.modules.auth.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Override
    @Async
    @Transactional
    public void logActivity(String action, String entityName, UUID entityId, String details, User performedBy) {
        log.info("Recording activity ngầm: {} {} by {}", action, entityName, performedBy.getEmail());
        ActivityLog activityLog = ActivityLog.builder()
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .performedBy(performedBy)
                .build();
        activityLogRepository.save(activityLog);
    }
}
