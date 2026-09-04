package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.request.TaskCommentRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.TaskCommentResponse;
import hsf302.fa25.s3.backend.modules.auth.service.TaskCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class TaskCommentController {

    private final TaskCommentService taskCommentService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskCommentResponse>> addComment(
            @PathVariable UUID taskId,
            @RequestBody TaskCommentRequest request,
            Principal principal) {
        
        UUID userId = UUID.fromString(principal.getName());
        request.setTaskId(taskId); // Ensure consistency
        
        TaskCommentResponse response = taskCommentService.addComment(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskCommentResponse>>> getComments(@PathVariable UUID taskId) {
        List<TaskCommentResponse> comments = taskCommentService.getCommentsByTaskId(taskId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", comments));
    }
}
