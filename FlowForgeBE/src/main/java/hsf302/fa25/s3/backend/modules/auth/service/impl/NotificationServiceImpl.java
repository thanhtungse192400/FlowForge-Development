package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.modules.auth.entity.Notification;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.repository.NotificationRepository;
import hsf302.fa25.s3.backend.modules.auth.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Async
    @Transactional
    public void sendNotification(User user, String title, String message) {
        log.info("Gửi notification ngầm tới user: {}", user.getEmail());
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .user(user)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
}
