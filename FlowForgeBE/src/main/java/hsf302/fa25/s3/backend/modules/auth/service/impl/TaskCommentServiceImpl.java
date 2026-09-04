package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.modules.auth.dto.request.TaskCommentRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.TaskCommentResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Task;
import hsf302.fa25.s3.backend.modules.auth.entity.TaskComment;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.repository.TaskCommentRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.TaskRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.UserRepository;
import hsf302.fa25.s3.backend.modules.auth.service.ActivityLogService;
import hsf302.fa25.s3.backend.modules.auth.service.NotificationService;
import hsf302.fa25.s3.backend.modules.auth.service.TaskCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskCommentServiceImpl implements TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public TaskCommentResponse addComment(UUID userId, TaskCommentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        TaskComment comment = TaskComment.builder()
                .content(request.getContent())
                .task(task)
                .user(user)
                .build();

        TaskComment savedComment = taskCommentRepository.save(comment);

        // Gọi Async Log Activity (chạy ngầm - không block response)
        activityLogService.logActivity(
                "COMMENT",
                "TASK",
                task.getId(),
                "User " + user.getEmail() + " commented on task: " + task.getTitle(),
                user
        );

        // Gọi Async Notification cho người tạo task (nếu khác người comment)
        if (task.getCreatedBy() != null && !task.getCreatedBy().getId().equals(userId)) {
            notificationService.sendNotification(
                    task.getCreatedBy(),
                    "New comment on your task",
                    user.getEmail() + " commented on " + task.getTitle()
            );
        }

        return mapToResponse(savedComment);
    }

    @Override
    public List<TaskCommentResponse> getCommentsByTaskId(UUID taskId) {
        return taskCommentRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TaskCommentResponse mapToResponse(TaskComment comment) {
        TaskCommentResponse response = modelMapper.map(comment, TaskCommentResponse.class);
        response.setTaskId(comment.getTask().getId());
        response.setUserId(comment.getUser().getId());
        response.setUserName(comment.getUser().getName());
        return response;
    }
}
