package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Notification;
import hsf302.fa25.s3.backend.modules.auth.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved successfully", notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable UUID id, Principal principal) {
        // Có thể validate xem notification id này có thuộc về user không nếu cần bảo mật thêm
        notificationService.markAsRead(id);
        
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }
}
