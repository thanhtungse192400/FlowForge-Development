package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.modules.auth.dto.request.TaskRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.TaskResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Task;
import org.modelmapper.ModelMapper;
import hsf302.fa25.s3.backend.modules.auth.exception.TaskError;
import hsf302.fa25.s3.backend.modules.auth.exception.TaskException;
import hsf302.fa25.s3.backend.modules.auth.entity.Project;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.repository.ProjectMemberRepository;
import hsf302.fa25.s3.backend.modules.auth.enums.ProjectRoleStatus;
import hsf302.fa25.s3.backend.modules.auth.repository.ProjectRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.TaskRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.UserRepository;
import hsf302.fa25.s3.backend.modules.auth.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Dùng của Spring thay vì Jakarta để có readOnly

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest req, UUID userId) {
        if (req.projectId == null) {
            throw new TaskException("Project ID is required to create a task");
        }

        Project project = projectRepository.findById(req.projectId)
                .orElseThrow(() -> new TaskException("Project not found with ID: " + req.projectId));

        // CHECK MEMBERSHIP
        boolean isMember = projectMemberRepository.existsByProject_ProjectIdAndUser_Id(req.projectId, userId);
        if (!isMember) {
            throw new TaskException("Access denied: You are not a member of this project");
        }

        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new TaskException("Creator user not found"));

        Task task = new Task();
        task.setTitle(req.title);
        task.setDescription(req.description);
        task.setStatus(req.status);
        task.setProject(project);
        task.setCreatedBy(creator);

        if (req.assignedToId != null) {
            User assignedTo = userRepository.findById(req.assignedToId)
                    .orElseThrow(() -> new TaskException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        }

        taskRepository.save(task);

        return mapToResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(UUID userId) {
        return taskRepository.findAllTasksByMemberId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(UUID id, UUID userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskException(TaskError.TASK_NOT_FOUND));

        // CHECK MEMBERSHIP IN PROJECT
        boolean isMember = projectMemberRepository.existsByProject_ProjectIdAndUser_Id(
                task.getProject().getProjectId(), userId
        );
        if (!isMember) {
            throw new TaskException("Access denied: You are not a member of the project this task belongs to");
        }

        return mapToResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(UUID id, TaskRequest req, UUID userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskException(TaskError.TASK_NOT_FOUND));

        // CHECK OWNER / PROJECT OWNER
        boolean isCreator = task.getCreatedBy() != null && task.getCreatedBy().getId().equals(userId);
        boolean isOwner = projectMemberRepository.existsByProject_ProjectIdAndUser_IdAndStatus(
                task.getProject().getProjectId(), userId, ProjectRoleStatus.OWNER
        );
        if (!isCreator && !isOwner) {
            throw new TaskException("Access denied: Only the task creator or project owner can update this task");
        }

        task.setTitle(req.title);
        task.setDescription(req.description);
        task.setStatus(req.status);

        if (req.projectId != null) {
            Project project = projectRepository.findById(req.projectId)
                    .orElseThrow(() -> new TaskException("Project not found with ID: " + req.projectId));
            task.setProject(project);
        }

        if (req.assignedToId != null) {
            User assignedTo = userRepository.findById(req.assignedToId)
                    .orElseThrow(() -> new TaskException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        } else {
            task.setAssignedTo(null);
        }

        taskRepository.save(task);
        return mapToResponse(task);
    }

    @Override
    @Transactional
    public void deleteTask(UUID id, UUID userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskException(TaskError.TASK_NOT_FOUND));

        // CHECK OWNER / PROJECT OWNER
        boolean isCreator = task.getCreatedBy() != null && task.getCreatedBy().getId().equals(userId);
        boolean isOwner = projectMemberRepository.existsByProject_ProjectIdAndUser_IdAndStatus(
                task.getProject().getProjectId(), userId, ProjectRoleStatus.OWNER
        );
        if (!isCreator && !isOwner) {
            throw new TaskException("Access denied: Only the task creator or project owner can delete this task");
        }

        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProjectId(UUID projectId, UUID userId) {
        // CHECK MEMBERSHIP
        boolean isMember = projectMemberRepository.existsByProject_ProjectIdAndUser_Id(projectId, userId);
        if (!isMember) {
            throw new TaskException("Access denied: You are not a member of this project");
        }

        return taskRepository.findAllByProjectProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = modelMapper.map(task, TaskResponse.class);
        response.setTaskId(task.getId());
        response.setProjectId(task.getProject() != null ? task.getProject().getProjectId() : null);
        response.setAssignedToId(task.getAssignedTo() != null ? task.getAssignedTo().getId() : null);
        response.setCreatedById(task.getCreatedBy() != null ? task.getCreatedBy().getId() : null);
        return response;
    }
}