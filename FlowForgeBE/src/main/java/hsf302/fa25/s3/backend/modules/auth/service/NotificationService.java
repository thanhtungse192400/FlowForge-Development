package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.entity.Notification;
import hsf302.fa25.s3.backend.modules.auth.entity.User;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void sendNotification(User user, String title, String message);
    List<Notification> getUnreadNotifications(UUID userId);
    void markAsRead(UUID notificationId);
}
