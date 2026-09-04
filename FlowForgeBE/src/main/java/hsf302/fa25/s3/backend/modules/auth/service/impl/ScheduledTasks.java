package hsf302.fa25.s3.backend.modules.auth.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {

    // Chạy mỗi ngày lúc 00:00 để kiểm tra các task quá hạn
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkOverdueTasks() {
        log.info("Bắt đầu kiểm tra task quá hạn lúc: {}", LocalDateTime.now());
        // TODO: Viết logic query các Task quá hạn và chuyển trạng thái
        // Có thể inject TaskRepository và NotificationService vào đây để dùng
    }
}
