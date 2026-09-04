package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.request.TaskRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.TaskResponse;
import hsf302.fa25.s3.backend.modules.auth.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'LEAD')")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @RequestBody TaskRequest req,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        TaskResponse response = taskService.createTask(req, userId);
        return ResponseEntity.ok(ApiResponse.success("Create task success", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        List<TaskResponse> response = taskService.getAllTasks(userId);
        return ResponseEntity.ok(ApiResponse.success(response.isEmpty() ? "There are no task" : "Get all tasks success", response));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByProject(
            @PathVariable UUID projectId,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        List<TaskResponse> response = taskService.getTasksByProjectId(projectId, userId);
        return ResponseEntity.ok(ApiResponse.success("Get tasks for project success", response));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable UUID id,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        TaskResponse response = taskService.getTaskById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Get task success", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable UUID id,
            @RequestBody TaskRequest req,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        TaskResponse response = taskService.updateTask(id, req, userId);
        return ResponseEntity.ok(ApiResponse.success("Update task success", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTask(
            @PathVariable UUID id,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Delete task success", null));
    }
}