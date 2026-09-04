package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.request.TaskCommentRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.TaskCommentResponse;

import java.util.List;
import java.util.UUID;

public interface TaskCommentService {
    TaskCommentResponse addComment(UUID userId, TaskCommentRequest request);
    List<TaskCommentResponse> getCommentsByTaskId(UUID taskId);
}
