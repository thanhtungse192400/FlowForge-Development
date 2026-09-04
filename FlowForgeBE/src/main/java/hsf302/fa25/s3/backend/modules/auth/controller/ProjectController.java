package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProjectRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectMemberResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectResponse;
import hsf302.fa25.s3.backend.modules.auth.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'LEAD')")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ApiResponse<ProjectResponse> createProject(
            @RequestBody ProjectRequest req,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        ProjectResponse response = projectService.createProject(req, userId);
        return ApiResponse.success("Create project success", response);
    }

    @GetMapping
    public ApiResponse<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> response = projectService.getAllProjects();
        return ApiResponse.success(response.isEmpty() ? "No projects" : "Get all success", response);
    }

    @GetMapping("/{id}")
    public ApiResponse<ProjectResponse> getProjectById(
            @PathVariable UUID id,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        ProjectResponse response = projectService.getProjectById(id, userId);
        return ApiResponse.success("Get project success", response);
    }

    @PutMapping("/{id}")
    public ApiResponse<ProjectResponse> updateProject(
            @PathVariable UUID id,
            @RequestBody ProjectRequest req,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        ProjectResponse response = projectService.updateProject(id, req, userId);
        return ApiResponse.success("Update success", response);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProject(
            @PathVariable UUID id,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        projectService.deleteProject(id, userId);
        return ApiResponse.success("Delete success", null);
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ProjectMemberResponse>> getProjectsByUser(
            @PathVariable UUID userId
    ) {
        List<ProjectMemberResponse> response = projectService.getProjectsByUser(userId);
        return ApiResponse.success(response.isEmpty() ? "No projects found" : "Get by user success", response);
    }

    @GetMapping("/my-projects")
    public ApiResponse<List<ProjectMemberResponse>> getMyProjects(
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        List<ProjectMemberResponse> response = projectService.getProjectsByUser(userId);
        return ApiResponse.success(response.isEmpty() ? "No projects found" : "Get by user success", response);
    }
}