package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.request.TaskRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.TaskResponse;

import java.util.List;
import java.util.UUID;

public interface TaskService {
    TaskResponse createTask(TaskRequest req, UUID userId);
    List<TaskResponse> getAllTasks(UUID userId);
    List<TaskResponse> getTasksByProjectId(UUID projectId, UUID userId);
    TaskResponse getTaskById(UUID id, UUID userId);
    TaskResponse updateTask(UUID id, TaskRequest req, UUID userId);
    void deleteTask(UUID id, UUID userId);
}